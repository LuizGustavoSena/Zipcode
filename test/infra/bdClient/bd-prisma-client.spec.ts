import { describe, expect, it, vi } from "vitest";
import { BdPrismaClient } from "../../../src/infra/bdClient/bd-prisma-client";
import { makeRequestCreateZipcode } from "../../data/mocks/insert-zipcode";

vi.mock('../helpers/prisma.ts');

type Props = {
    sut: BdPrismaClient
};

const makeSut = (): Props => {
    const sut = new BdPrismaClient();

    return {
        sut
    }
};

describe('BbPrismaClient', () => {
    it('Should create first zipcode', async () => {
        const { sut } = makeSut();

        const request = makeRequestCreateZipcode();

        await sut.createZipcode(request);

        const zipcodes = await sut.prisma.zipcodes.findFirst({
            where: { email: request.email }
        });

        console.log({ zipcodes })

        expect(zipcodes.zipcodes.length).toBe(1);
        expect(zipcodes.zipcodes[0]).toBe(request.zipcode);
    });
});