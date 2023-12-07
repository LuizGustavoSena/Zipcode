require('dotenv/config');
import Fastify from 'fastify';
import * as AccountControler from './main/controllers/remote-account';
import * as ValidateControler from './main/controllers/remote-validate-token';

const fastify = Fastify({
    logger: true
});

fastify.post('/create_account', AccountControler.createAccount);

fastify.post('/login_account', AccountControler.loginAccount);

fastify.get('/validate_token', ValidateControler.validateToken);

fastify.listen({
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0',
}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})