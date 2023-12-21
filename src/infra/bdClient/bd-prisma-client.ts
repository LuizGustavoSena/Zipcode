import { PrismaClient } from "@prisma/client";
import { BdClient } from "../../data/protocols/bd";
import { GetzipcodesParsms, RequestGetZipcode, RequestInsertZipcode } from "../../domain/models";

export class BdPrismaClient implements BdClient {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        await this.prisma.zipcodes.create({
            data: {
                email: params.email,
                zipcode: params.zipcode,
                name: params.name
            }
        });
    }

    async getZipcode(params: RequestGetZipcode): Promise<GetzipcodesParsms[]> {
        const zipcodes = await this.prisma.zipcodes.findMany({
            where: { email: params.email }
        });

        if (!zipcodes || zipcodes.length === 0)
            return null;

        return zipcodes;
    }
}