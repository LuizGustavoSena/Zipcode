import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeRemoteZipcode } from "../factories/use-cases/remote-zipcode";

const remoteZipcode = makeRemoteZipcode();

const validationCreateZipcode = z.object({
    code: z.string(),
    name: z.string()
});

export const createZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const { code, name } = req.body as { code: string; name: string };

    validationCreateZipcode.parse({
        code,
        name
    });

    await remoteZipcode.insertZipcode({
        email: req.user.email,
        code,
        name
    });

    rep.statusCode = 201;
    rep.send();
};

export const deleteZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const { code } = req.params as { code: string };

    await remoteZipcode.deleteZipcode({
        email: req.user.email,
        code
    });

    rep.statusCode = 200;
    rep.send();
}

export const getZipcodes = async (req: FastifyRequest, rep: FastifyReply) => {
    const zipcodes = await remoteZipcode.getZipcode({
        email: req.user.email,
    });

    rep.statusCode = zipcodes.length > 0 ? 200 : 204;
    rep.send({ zipcodes });
};

export const getTrackingZipcode = async (req: FastifyRequest, rep: FastifyReply) => {
    const { code } = req.params as { code: string };

    const trackingRoute = await remoteZipcode.getTrackingByZipcode(code);

    rep.statusCode = 200;
    rep.send({ trackingRoute });
}; 