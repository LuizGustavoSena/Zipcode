import { ZipcodesParams } from "../models";

export interface GetTrackingZipcode {
    getTrackingByZipcode(zipcode: string): Promise<ZipcodesParams>;
}