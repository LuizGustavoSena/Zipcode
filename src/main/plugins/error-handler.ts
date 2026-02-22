import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ZodError } from "zod";
import { AppError } from "../../domain/error/app-error";

type ErrorResponse = {
    error: {
        message: string;
        code?: string;
        details?: unknown;
    };
};

const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
    app.setErrorHandler((err, request, reply) => {
        if (err instanceof ZodError) {
            const body: ErrorResponse = {
                error: {
                    message: "Validation error",
                    code: "VALIDATION_ERROR",
                    details: err.issues.map((i) => ({
                        path: i.path.join("."),
                        message: i.message,
                    })),
                },
            };
            return reply.status(400).send(body);
        }

        if (err instanceof AppError) {
            const body: ErrorResponse = {
                error: {
                    message: err.message,
                    code: err.code,
                    details: err.details,
                },
            };
            return reply.status(err.statusCode).send(body);
        }

        const anyErr = err as any;
        if (typeof anyErr?.statusCode === "number") {
            const body: ErrorResponse = {
                error: {
                    message: anyErr.message ?? "Request error",
                    code: anyErr.code,
                },
            };
            return reply.status(anyErr.statusCode).send(body);
        }

        request.log.error({ err }, "Unhandled error");
        const body: ErrorResponse = {
            error: {
                message: "Internal server error",
                code: "INTERNAL_SERVER_ERROR",
            },
        };
        return reply.status(500).send(body);
    });
};

export default fp(errorHandlerPlugin, { name: "error-handler" });