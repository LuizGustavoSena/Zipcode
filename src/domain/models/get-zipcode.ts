export type RequestGetZipcode = {
    email: string;
    zipcode: string[];
}

export type ResponseGetZipcode = {
    zipcodes: ZipcodesParams[];
}

export enum EnumStatusZipcode {
    COMPLETED = 'completed',
    PENDING = 'pending',
    NOTFOUND = 'notFound'
}

export type ZipcodesParams = {
    code: string;
    status: EnumStatusZipcode;
    routes?: RouteParams[];
}

export type RouteParams = {
    start: string;
    end: string;
    date: string;
}
