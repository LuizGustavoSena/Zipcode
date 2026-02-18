import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { HttpClient, MethodHttp } from "../../data/protocols/http";
import { AuthApiResponse } from "../../domain/models/api-authenticate";
import { env } from "../../infra/zod/env";
import { makeAxiosHttpClient } from "../factories/http/axios-http-client";

function extractBearerToken(authorization?: string): string | null {
    if (!authorization) return null;
    const [type, token] = authorization.split(" ");
    if (type?.toLowerCase() !== "bearer" || !token) return null;
    return token;
}

const httpClient = makeAxiosHttpClient() as HttpClient;

export const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest("user", null);

    fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        const token = extractBearerToken(request.headers.authorization);
        if (!token) {
            return reply.code(401).send({ message: "Missing or invalid Authorization header" });
        }

        try {
            const res = await httpClient.request<AuthApiResponse>({
                url: `${env.AUTH_URL}/validate`,
                method: MethodHttp.GET,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res?.body?.id || !res?.body?.email) {
                fastify.log.warn({ res }, "Auth API returned unexpected payload");
                return reply.code(401).send({ message: "Invalid auth payload" });
            }

            request.user = {
                id: String(res.body.id),
                email: String(res.body.email),
            };
        } catch (err) {
            fastify.log.error({ err }, "Auth API request failed");
            return reply.code(502).send({ message: "Auth service unavailable" });
        }
    });
};

export default fp(authPlugin, { name: "auth-plugin" });
