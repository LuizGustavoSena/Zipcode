export type RequestGetZipcode = {
    email: string;
}

export type ZipcodesParams = {
    code: string;
    status: string;
    routes?: RouteParams[];
}

export type RouteParams = {
    start: string;
    end: string;
    date: string;
    description: string;
}