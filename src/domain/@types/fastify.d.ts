import "fastify";
import type { FastifyReply } from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }

    interface FastifyRequest {
        user: {
            email: string;
        };
    }
}
