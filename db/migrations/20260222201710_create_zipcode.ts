import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('zipcodes', (table) => {
        table.uuid('id').primary();
        table.string('email').notNullable();
        table.string('name').notNullable();
        table.string('code').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('zipcodes');
}

