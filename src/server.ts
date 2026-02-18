import cors from '@fastify/cors';
import Fastify from 'fastify';
import https from 'https';
import { NotAllowedError } from './domain/error/not-allowed-error';
import { env } from './infra/zod/env';
import * as ZipcodeControler from './main/controllers/remote-zipcode';
import { authPlugin } from './main/plugins/auth';

const fastify = Fastify({
    logger: true
});

fastify.register(cors, {
    origin: (origin, cb) => {
        if (env.NODE_ENV !== 'prd' || new URL(origin).hostname === env.URL_WEB_SITE) {
            cb(null, true);
            return;
        };

        cb(new NotAllowedError(), false);
    }
});

fastify.register(authPlugin);

fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook("preHandler", protectedRoutes.authenticate);

    protectedRoutes.post('/create_zipcode', ZipcodeControler.createZipcode);
    protectedRoutes.get('/zipcode', ZipcodeControler.getZipcodes);
    protectedRoutes.delete('/zipcode/:zipcode', ZipcodeControler.deleteZipcode);
}, { prefix: "/v1" });

fastify.get('/', (_, rep) => { rep.send() });

if (env.NODE_ENV === 'prd') {
    setInterval(() => {
        https.get(env.URL_API_ZIPCODE);
    }, 14 * 60 * 1000);
}

fastify.listen({
    port: env.PORT,
    host: '0.0.0.0',
}, function (err) {
    if (!err) return;

    fastify.log.error(err);
    process.exit(1);
})