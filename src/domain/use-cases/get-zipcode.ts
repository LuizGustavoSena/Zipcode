import { RequestGetZipcode, ZipcodesParams } from "../models";

export interface GetZipcode {
    getZipcode(params: RequestGetZipcode): Promise<ZipcodesParams[]>;
}