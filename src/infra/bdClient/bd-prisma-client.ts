import { PrismaClient } from "@prisma/client";
import { BdClient } from "../../data/protocols/bd";
import { GetzipcodesParsms, RequestGetZipcode, RequestInsertZipcode } from "../../domain/models";
import { ModelDeleteZipcode } from "../../domain/models/delete-zipcode";

export class BdPrismaClient implements BdClient {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    };

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        await this.prisma.zipcodes.create({
            data: {
                email: params.email,
                zipcode: params.zipcode,
                name: params.name
            }
        });
    }

    async deleteZipcode(params: ModelDeleteZipcode): Promise<void> {
        const { email, zipcode } = params;

        const response = await this.prisma.zipcodes.findFirst({
            where: {
                zipcode
            }
        });

        if (!response || response.email !== email)
            return null;

        await this.prisma.zipcodes.delete({
            where: {
                id: response.id,
                email: response.email,
                name: response.name,
                zipcode: response.zipcode
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