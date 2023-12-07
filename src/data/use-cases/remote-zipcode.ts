import { RequestGetZipcode, RequestInsertZipcode, ResponseGetZipcode } from "../../domain/models";
import { GetZipcode, InsertZipcode } from "../../domain/use-cases";
import { BdClient } from "../protocols/bd";

export class RemoteZipcode implements InsertZipcode, GetZipcode {
    constructor(
        private bdClient: BdClient
    ) { }

    async insertZipcode(params: RequestInsertZipcode): Promise<void> {
        this.bdClient.createZipcode(params);
    };

    async getZipcode(params: RequestGetZipcode): Promise<ResponseGetZipcode> {
        const zipCodes = await this.bdClient.getZipcode(params);

        return null;
    };
}