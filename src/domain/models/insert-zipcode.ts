export type RequestInsertZipcode = {
    email: string;
    code: string;
    name: string;
}

export type Zipcode = { id: string } & RequestInsertZipcode;