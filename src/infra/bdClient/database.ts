import { Knex, knex as setupKnex } from 'knex';
import { env } from '../zod/env';

export const config: Knex.Config = {
    client: "pg",
    connection: env.DATABASE_URL,
    migrations: {
        directory: "./db/migrations",
        extension: "ts",
    },
};

export const knex = setupKnex(config);