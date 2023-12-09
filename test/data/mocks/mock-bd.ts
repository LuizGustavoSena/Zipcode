import { BdClient } from "../../../src/data/protocols/bd";
import { RequestGetZipcode, RequestInsertZipcode } from "../../../src/domain/models";

export class BdClientSpy implements BdClient {
    zipcodes: string[] = [];
    email: string;

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        this.email = params.email;
        this.zipcodes.push(params.zipcode);
    }

    async getZipcode(params: RequestGetZipcode): Promise<string[]> {
        if (params.email !== this.email)
            return [];

        return this.zipcodes;
    }
}