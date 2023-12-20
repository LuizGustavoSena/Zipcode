require('dotenv/config');
import { FastifyReply, FastifyRequest } from "fastify";
import { HttpStatusCode, MethodHttp } from "../../data/protocols/http";
import { ErrorGetTracking } from "../../domain/error/error-get-tracking";
import { makeAxiosHttpClient } from "../factories/http/axios-http-client";
import { makeRemoteZipcode } from "../factories/use-cases/remote-zipcode";

const remoteZipcode = makeRemoteZipcode();
const httpClient = makeAxiosHttpClient();

export const createZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const authenticated = await authentication(req, rep);

    const { zipcode } = req.body as { zipcode: string };

    try {
        await remoteZipcode.insertZipcode({
            email: authenticated.email,
            zipcode
        });

        rep.statusCode = 201;
        rep.send();
    } catch (error: any) {
        rep.log.info(error.message);

        rep.statusCode = 500;
        rep.send('Erro inesperado');
    }
};

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