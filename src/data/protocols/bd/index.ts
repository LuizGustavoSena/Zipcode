import { RequestGetZipcode, RequestInsertZipcode } from "../../../domain/models";

export interface BdClient {
    createZipcode(params: RequestInsertZipcode): Promise<void>;
    getZipcode(params: RequestGetZipcode): Promise<string[]>
};