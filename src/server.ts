require('dotenv/config');
import cors from '@fastify/cors';
import Fastify from 'fastify';
import https from 'https';
import * as ZipcodeControler from './main/controllers/remote-zipcode';

const fastify = Fastify({
    logger: true
});

fastify.register(cors, {
    origin: (origin, cb) => {
        if (process.env.ENVIRONMENT === 'development' || new URL(origin).hostname === process.env.URL_WEB_SITE) {
            cb(null, true);
            return;
        };

        cb(new Error("Not allowed"), false);
    }
});

fastify.post('/create_zipcode', ZipcodeControler.createZipcode);

fastify.get('/zipcode', ZipcodeControler.getZipcodes);

fastify.get('/', (_, rep) => {
    console.log('Ping received');

    rep.send();
});

setInterval(() => {
    if (process.env.ENVIRONMENT === 'production')
        https.get(process.env.URL_API_ZIPCODE);
}, Number(process.env.MINUTES_REQUEST) * 60 * 1000);

fastify.listen({
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0',
}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})