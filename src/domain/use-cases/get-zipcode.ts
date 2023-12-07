import { RequestGetZipcode, ResponseGetZipcode } from "../models";

export interface GetZipcode {
    getZipcode(params: RequestGetZipcode): Promise<ResponseGetZipcode>;
}