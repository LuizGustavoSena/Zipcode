import axios, { AxiosResponse } from "axios";
import { HttpClient, HttpRequest, HttpResponse } from "../../data/protocols/http";

export class AxiosHttpClient implements HttpClient {
    request = async (params: HttpRequest): Promise<HttpResponse<any>> => {
        const { method, url, body, headers } = params;
        let response: AxiosResponse;

        try {
            response = await axios.request({
                url: url,
                method: method,
                data: body,
                headers: headers
            });
        } catch (error: any) {
            response = error.response
        }

        return {
            statusCode: response.status,
            body: response.data
        }
    }
}