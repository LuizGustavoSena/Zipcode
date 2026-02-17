import cors from '@fastify/cors';
import Fastify from 'fastify';
import https from 'https';
import { env } from './infra/zod/env';
import * as ZipcodeControler from './main/controllers/remote-zipcode';

const fastify = Fastify({
    logger: true
});

fastify.register(cors, {
    origin: (origin, cb) => {
        if (env.NODE_ENV !== 'prd' || new URL(origin).hostname === env.URL_WEB_SITE) {
            cb(null, true);
            return;
        };

        cb(new Error("Not allowed"), false);
    }
});

fastify.post('/create_zipcode', ZipcodeControler.createZipcode);

fastify.get('/zipcode', ZipcodeControler.getZipcodes);

fastify.delete('/zipcode/:zipcode', ZipcodeControler.deleteZipcode);

fastify.get('/', (_, rep) => {
    console.log('Ping received');

    rep.send();
});

setInterval(() => {
    if (env.NODE_ENV === 'prd')
        https.get(env.URL_API_ZIPCODE);
}, 14 * 60 * 1000);

fastify.listen({
    port: env.PORT,
    host: '0.0.0.0',
}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})