export interface HttpClient {
    request<T>(params: Request): Promise<Response<T>>
};

export enum HttpStatusCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbbiden = 403,
    NotFound = 404,
    ServerError = 500,
};

export type Request = {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    url: string;
    body?: any;
    headers?: any
};

export type Response<T> = {
    statusCode: HttpStatusCode;
    body: T;
};