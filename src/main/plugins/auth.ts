import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { HttpStatusCode, MethodHttp } from "../../data/protocols/http";
import { AuthenticatorError } from "../../domain/error/authenticator-error";
import { InternalServerError } from "../../domain/error/internal-server-error";
import { AuthApiResponse } from "../../domain/models/api-authenticate";
import { env } from "../../infra/zod/env";
import { makeAxiosHttpClient } from "../factories/http/axios-http-client";

function extractBearerToken(authorization?: string): string | null {
    if (!authorization) return null;
    const [type, token] = authorization.split(" ");
    if (type?.toLowerCase() !== "bearer" || !token) return null;
    return token;
}

const httpClient = makeAxiosHttpClient();

export const authPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest("user", null);

    fastify.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
        const token = extractBearerToken(request.headers.authorization);
        if (!token) {
            throw new AuthenticatorError();
        }

        try {
            const res = await httpClient.request<AuthApiResponse>({
                url: env.AUTH_URL,
                method: MethodHttp.GET,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res?.body?.id || !res?.body?.email) {
                fastify.log.warn({ res }, "Auth API returned unexpected payload");
                throw new AuthenticatorError();
            }

            request.user = {
                id: String(res.body.id),
                email: String(res.body.email),
            };
        } catch (err: any) {
            if (err.statusCode === HttpStatusCode.Unauthorized)
                throw new AuthenticatorError();

            fastify.log.error({ err }, "Auth API request failed");
            throw new InternalServerError();
        }
    });
};

export default fp(authPlugin, { name: "auth-plugin" });
