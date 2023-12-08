import { describe, expect, it, vi } from 'vitest';
import { AxiosHttpClient } from "../../../src/infra/http/axios-http-client";
import { mockRequest } from '../../data/mocks/mock-http';
import { mockAxios } from './helpers/axios';

vi.mock('axios');

type SutTypes = {
    sut: AxiosHttpClient;
    mockedAxios: any;
};

const makeSut = (): SutTypes => {
    const sut = new AxiosHttpClient();
    const mockedAxios = mockAxios();
    return {
        sut,
        mockedAxios,
    };
};

describe('AxiosHttpClient', async () => {
    it('Should call axios with correct values', async () => {
        const request = mockRequest();
        const { sut, mockedAxios } = makeSut();

        await sut.request(request);

        expect(mockedAxios.request).toHaveBeenCalledWith({
            url: request.url,
            data: request.body,
            headers: request.headers,
            method: request.method,
        });
    });

    it('Should return correct response', async () => {
        const { sut, mockedAxios } = makeSut();

        const httpResponse = await sut.request(mockRequest());
        const axiosResponse = await mockedAxios.request.mock.results[0].value;

        expect(httpResponse).toEqual({
            statusCode: axiosResponse.status,
            headers: axiosResponse.headers,
            body: axiosResponse.data,
        });
    });

    it('Should return correct error', () => {
        const { sut, mockedAxios } = makeSut();
        mockedAxios.request.mockRejectedValueOnce({
            response: mockRequest(),
        });

        const promise = sut.request(mockRequest());

        expect(promise).toEqual(mockedAxios.request.mock.results[0].value);
    });
});