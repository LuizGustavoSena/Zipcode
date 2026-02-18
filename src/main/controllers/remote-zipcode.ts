require('dotenv/config');
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";
import { DeleteZipcodeError } from "../../domain/error/delete-zipcode-error";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { makeRemoteZipcode } from "../factories/use-cases/remote-zipcode";

const remoteZipcode = makeRemoteZipcode();

const validationCreateZipcode = z.object({
    zipcode: z.string(),
    name: z.string()
});

export const createZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const { zipcode, name } = req.body as { zipcode: string; name: string };

    try {
        validationCreateZipcode.parse({
            zipcode,
            name
        });

        await remoteZipcode.insertZipcode({
            email: req.user.email,
            zipcode,
            name
        });

        rep.statusCode = 201;
        rep.send();
    } catch (error: any) {
        rep.log.info(error.message);

        rep.statusCode = error instanceof ZodError ? 415 : 500;
        rep.send(error instanceof ZodError ? error.message : 'Erro inesperado');
    }
};

export const deleteZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const { zipcode } = req.params as { zipcode: string };

    try {
        await remoteZipcode.deleteZipcode({
            email: req.user.email,
            zipcode
        });

        rep.statusCode = 200;
        rep.send();
    } catch (error: any) {
        rep.statusCode = error instanceof DeleteZipcodeError ?
            404 : 500;

        const msg = error instanceof DeleteZipcodeError ?
            error.message : 'Erro inesperado';

        if (!(error instanceof DeleteZipcodeError))
            rep.log.info(error.message);

        rep.send(msg);
    }
}

export const getZipcodes = async (req: FastifyRequest, rep: FastifyReply) => {
    try {
        const zipcodes = await remoteZipcode.getZipcode({
            email: req.user.email,
        });

        rep.statusCode = zipcodes.length > 0 ? 200 : 204;
        rep.send({ zipcodes });
    } catch (error: any) {
        rep.statusCode = error instanceof ErrorGetTracking ?
            400 : 500;

        const msg = error instanceof ErrorGetTracking ?
            error.message : 'Erro inesperado';

        if (!(error instanceof ErrorGetTracking))
            rep.log.info(error.message);

        rep.send(msg);
    }
};