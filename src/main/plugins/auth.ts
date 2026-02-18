import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { AuthApiResponse } from "../../domain/models/api-authenticate";

function extractBearerToken(authorization?: string): string | null {
    if (!authorization) return null;
    const [type, token] = authorization.split(" ");
    if (type?.toLowerCase() !== "bearer" || !token) return null;
    return token;
}

export const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest("user", null);

    fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        const token = extractBearerToken(request.headers.authorization);
        if (!token) {
            return reply.code(401).send({ message: "Missing or invalid Authorization header" });
        }

        try {
            const res = await fetch(`${process.env.AUTH_URL}/validate`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                return reply.code(401).send({ message: "Invalid token" });
            }

            const data = (await res.json()) as AuthApiResponse;

            if (!data?.id || !data?.email) {
                fastify.log.warn({ data }, "Auth API returned unexpected payload");
                return reply.code(401).send({ message: "Invalid auth payload" });
            }

            request.user = {
                id: String(data.id),
                email: String(data.email),
            };
        } catch (err) {
            fastify.log.error({ err }, "Auth API request failed");
            return reply.code(502).send({ message: "Auth service unavailable" });
        }
    });
};

export default fp(authPlugin, { name: "auth-plugin" });
