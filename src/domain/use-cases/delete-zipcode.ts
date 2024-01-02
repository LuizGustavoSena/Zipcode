import { ModelDeleteZipcode } from "../models/delete-zipcode";

export interface DeleteZipcode {
    deleteZipcode(params: ModelDeleteZipcode): Promise<void>;
}