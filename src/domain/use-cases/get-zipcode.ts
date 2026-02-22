import { GetzipcodesParsms, RequestGetZipcode } from "../models";

export interface GetZipcode {
    getZipcode(params: RequestGetZipcode): Promise<GetzipcodesParsms[]>;
}