require('dotenv/config');
import { FastifyReply, FastifyRequest } from "fastify";
import { ZodError, z } from "zod";
import { HttpStatusCode, MethodHttp } from "../../data/protocols/http";
import { DeleteZipcodeError } from "../../domain/error/delete-zipcode-error";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { makeAxiosHttpClient } from "../factories/http/axios-http-client";
import { makeRemoteZipcode } from "../factories/use-cases/remote-zipcode";

const remoteZipcode = makeRemoteZipcode();
const httpClient = makeAxiosHttpClient();

const validationCreateZipcode = z.object({
    zipcode: z.string(),
    name: z.string()
});

export const createZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const authenticated = await authentication(req, rep);

    const { zipcode, name } = req.body as { zipcode: string; name: string };

    try {
        validationCreateZipcode.parse({
            zipcode,
            name
        });

        await remoteZipcode.insertZipcode({
            email: authenticated.email,
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
    const authenticated = await authentication(req, rep);

    const { zipcode } = req.params as { zipcode: string };

    try {
        await remoteZipcode.deleteZipcode({
            email: authenticated.email,
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
    const authenticated = await authentication(req, rep);

    try {
        const zipcodes = await remoteZipcode.getZipcode({
            email: authenticated.email,
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

const authentication = async (req: FastifyRequest, rep: FastifyReply) => {
    const response = await httpClient.request({
        method: MethodHttp.GET,
        url: String(process.env.URL_AUTHENTICATION),
        headers: {
            Authorization: req.headers.authorization
        }
    });

    if (response.statusCode === HttpStatusCode.Unauthorized) {
        rep.statusCode = 401;
        rep.send();

        return;
    }

    return response.body;
}