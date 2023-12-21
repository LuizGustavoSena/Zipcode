export type RequestGetZipcode = {
    email: string;
}

export type ZipcodesParams = {
    code: string;
    name: string;
    status: string;
    routes?: RouteParams[];
}

export type RouteParams = {
    start: string;
    end: string;
    date: string;
    description: string;
}

export type GetzipcodesParsms = {
    id: string;
    email: string;
    name: string;
    zipcode: string;
}