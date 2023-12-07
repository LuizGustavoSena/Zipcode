import { BdClient, ResponseGetZipcode } from "../../../src/data/protocols/bd";
import { RequestGetZipcode, RequestInsertZipcode } from "../../../src/domain/models";

export class BdClientSpy implements BdClient {
    zipcodes: string[] = [];
    email: string;

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        this.email = params.email;
        this.zipcodes.push(params.zipcode);
    }

    getZipcode(params: RequestGetZipcode): Promise<ResponseGetZipcode> {
        throw new Error("Method not implemented.");
    }
}