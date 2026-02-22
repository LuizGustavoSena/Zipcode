import { BdClient } from "../../data/protocols/bd";
import { DatabaseError } from "../../domain/error/database-error";
import { GetzipcodesParsms, RequestGetZipcode, Zipcode } from "../../domain/models";
import { ModelDeleteZipcode } from "../../domain/models/delete-zipcode";
import { knex } from "./database";

export class KnexBdClient implements BdClient {
    repository = knex;

    constructor() { }

    createZipcode = async (params: Zipcode): Promise<void> => {
        try {
            const response = await this.repository.insert(params, '*').into('zipcodes');

            return response[0];
        } catch (error: any) {
            throw new DatabaseError(error.routine);
        }
    }

    getZipcode = async (params: RequestGetZipcode): Promise<GetzipcodesParsms[]> => {
        try {
            const response = await this.repository('zipcodes').where(params).select();

            return response;
        } catch (error: any) {
            throw new DatabaseError(error.routine);
        }
    }

    deleteZipcode = async (params: ModelDeleteZipcode): Promise<void> => {
        try {
            await this.repository('zipcodes').where(params).del();
        } catch (error: any) {
            throw new DatabaseError(error.routine);
        }
    };
}