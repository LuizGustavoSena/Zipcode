export interface HttpClient {
    request<T>(params: HttpRequest): Promise<HttpResponse<T>>
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

export enum MethodHttp {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
}

export type HttpRequest = {
    method: MethodHttp;
    url: string;
    body?: any;
    headers?: any
};

export type HttpResponse<T> = {
    statusCode: HttpStatusCode;
    body?: T;
};