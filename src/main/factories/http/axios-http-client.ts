import { HttpClient } from "../../../data/protocols/http";
import { AxiosHttpClient } from "../../../infra/http/axios-http-client";

export const makeAxiosHttpClient = (): HttpClient => new AxiosHttpClient();