require('dotenv/config');
import Fastify from 'fastify';
import https from 'https';
import * as ZipcodeControler from './main/controllers/remote-zipcode';

const fastify = Fastify({
    logger: true
});

fastify.post('/create_zipcode', ZipcodeControler.createZipcode);

fastify.get('/zipcode', ZipcodeControler.getZipcodes);

fastify.get('/', (_, rep) => {
    console.log('Ping received');

    rep.send();
});

setInterval(() => {
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