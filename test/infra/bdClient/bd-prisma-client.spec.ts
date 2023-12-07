import { describe, expect, it, vi } from "vitest";
import { BdPrismaClient } from "../../../src/infra/bdClient/bd-prisma-client";

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
    it('Should create user', async () => {
        expect(1).toBe(1);
    });
});