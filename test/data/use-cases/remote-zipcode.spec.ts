import { describe, expect, it } from 'vitest';
import { RemoteZipcode } from "../../../src/data/use-cases/remote-zipcode";
import { makeResponseGetZipcode } from '../../domain/mocks/get-zipcodes';
import { makeRequestCreateZipcode } from "../mocks/insert-zipcode";
import { BdClientSpy } from "../mocks/mock-bd";
import { HttpClientSpy } from '../mocks/mock-http';

type Props = {
    sut: RemoteZipcode;
    bdClientSpy: BdClientSpy;
    httpClientSpy: HttpClientSpy
}

const makeSut = (): Props => {
    const bdClientSpy = new BdClientSpy();
    const httpClientSpy = new HttpClientSpy();
    const sut = new RemoteZipcode(bdClientSpy, httpClientSpy);

    return {
        sut,
        bdClientSpy,
        httpClientSpy
    }
}

describe('RemoteZipcode', () => {
    it('Should correct create zipcode', async () => {
        const { sut, bdClientSpy, httpClientSpy } = makeSut();

        const request = makeRequestCreateZipcode();

        httpClientSpy.response.body = makeResponseGetZipcode();

        await sut.insertZipcode(request);

        const response = await sut.getZipcode({ email: request.email });

        expect(request.email).toBe(bdClientSpy.email);
        expect(bdClientSpy.zipcodes.includes(request.zipcode)).true;

        expect(response.length).toBe(1);
        expect(response[0]).not.null.undefined;
    });

    it('Should correct create another zipcode', async () => {
        const { sut, httpClientSpy } = makeSut();

        const firstRequest = makeRequestCreateZipcode();
        const secondRequest = makeRequestCreateZipcode({ email: firstRequest.email });

        httpClientSpy.response.body = makeResponseGetZipcode();

        await sut.insertZipcode(firstRequest);
        await sut.insertZipcode(secondRequest);

        const response = await sut.getZipcode({ email: firstRequest.email });

        expect(response.length).toBe(2);
        expect(response[0]).not.null.undefined;
        expect(response[1]).not.null.undefined;
    })
})
