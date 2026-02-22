import { GetzipcodesParsms, RequestGetZipcode, Zipcode } from "../../../domain/models";
import { ModelDeleteZipcode } from "../../../domain/models/delete-zipcode";

export interface BdClient {
    createZipcode(params: Zipcode): Promise<void>;
    getZipcode(params: RequestGetZipcode): Promise<GetzipcodesParsms[]>;
    deleteZipcode(params: ModelDeleteZipcode): Promise<void>;
};