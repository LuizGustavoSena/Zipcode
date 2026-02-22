import { describe, expect, it, vi } from "vitest";
import { KnexBdClient } from "../../../src/infra/bdClient/bd-knex-client";
import { makeRequestCreateZipcode } from "../../data/mocks/insert-zipcode";

vi.mock('../helpers/prisma.ts');

type Props = {
    sut: KnexBdClient
};

const makeSut = (): Props => {
    const sut = new KnexBdClient();

    return {
        sut
    }
};

describe('KnexBdClient', () => {
    it('Should create first zipcode', async () => {
        const { sut } = makeSut();

        const request = makeRequestCreateZipcode();

        await sut.createZipcode(request);

        const zipcodes = await sut.prisma.zipcodes.findFirst({
            where: { email: request.email }
        });

        expect(zipcodes.zipcodes.length).toBe(1);
        expect(zipcodes.zipcodes[0]).toBe(request.zipcode);
    });

    it('Should create another zipcode', async () => {
        const { sut } = makeSut();

        const firstRequest = makeRequestCreateZipcode();
        const secondRequest = makeRequestCreateZipcode({ email: firstRequest.email });

        await sut.createZipcode(firstRequest);
        await sut.createZipcode(secondRequest);

        const zipcodes = await sut.prisma.zipcodes.findFirst({
            where: { email: firstRequest.email }
        });

        expect(zipcodes.zipcodes.length).toBe(2);
        expect(zipcodes.zipcodes[0]).toBe(firstRequest.zipcode);
        expect(zipcodes.zipcodes[1]).toBe(secondRequest.zipcode);
    });
});