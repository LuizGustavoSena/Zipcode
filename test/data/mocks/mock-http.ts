import { faker } from "@faker-js/faker";
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, MethodHttp } from "../../../src/data/protocols/http";

type RequestProps = {
    method?: MethodHttp;
    url?: string;
    body?: any;
    headers?: any;
};

const methods = ['get', 'post', 'put', 'delete', 'patch'];
export const mockRequest = (params?: RequestProps): HttpRequest => {
    return {
        method: params?.method ?? methods[(Math.floor(Math.random() * methods.length))] as MethodHttp,
        url: params?.url ?? faker.internet.url(),
        body: params?.body ?? faker.airline,
        headers: params?.headers ?? faker.airline,
    }
}

export class HttpClientSpy<T = any> implements HttpClient {
    url?: string;
    method?: string;
    body?: any;
    headers?: any;
    response: HttpResponse<T> = {
        statusCode: HttpStatusCode.Ok
    }

    async request(params: HttpRequest): Promise<{ statusCode: HttpStatusCode; body?: any; }> {
        const { method, url, body, headers } = params;

        this.url = url;
        this.method = method;
        this.body = body;
        this.headers = headers;

        return this.response;
    }
}