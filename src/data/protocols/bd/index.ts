import { GetzipcodesParsms, RequestGetZipcode, RequestInsertZipcode } from "../../../domain/models";
import { ModelDeleteZipcode } from "../../../domain/models/delete-zipcode";

export interface BdClient {
    createZipcode(params: RequestInsertZipcode): Promise<void>;
    getZipcode(params: RequestGetZipcode): Promise<GetzipcodesParsms[]>;
    deleteZipcode(params: ModelDeleteZipcode): Promise<void>;
};