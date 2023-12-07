import { describe, expect, it } from 'vitest';
import { RemoteZipcode } from "../../../src/data/use-cases/remote-zipcode";
import { makeRequestCreateZipcode } from "../mocks/insert-zipcode";
import { BdClientSpy } from "../mocks/mock-bd";

type Props = {
    sut: RemoteZipcode;
    bdClientSpy: BdClientSpy;
}

const makeSut = (): Props => {
    const bdClientSpy = new BdClientSpy();
    const sut = new RemoteZipcode(bdClientSpy);

    return {
        sut,
        bdClientSpy
    }
}

describe('RemoteZipcode', () => {
    it('Should correct create zipcode', () => {
        const { sut, bdClientSpy } = makeSut();

        const request = makeRequestCreateZipcode();

        sut.insertZipcode(request);

        expect(request.email).toBe(bdClientSpy.email);
        expect(bdClientSpy.zipcodes.includes(request.zipcode)).true;
    })
})