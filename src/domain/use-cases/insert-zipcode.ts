import { RequestInsertZipcode } from "../models";

export interface InsertZipcode {
    insertZipcode(params: RequestInsertZipcode): Promise<void>;
}


