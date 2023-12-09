import { PrismaClient } from "@prisma/client";
import { BdClient } from "../../data/protocols/bd";
import { RequestGetZipcode, RequestInsertZipcode } from "../../domain/models";

export class BdPrismaClient implements BdClient {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        const haveZipcodes = await this.getZipcode({ email: params.email });

        if (haveZipcodes) {
            haveZipcodes.push(params.zipcode);

            await this.prisma.zipcodes.update({
                where: { email: params.email },
                data: {
                    zipcodes: haveZipcodes
                }
            });

            return;
        }

        await this.prisma.zipcodes.create({
            data: {
                email: params.email,
                zipcodes: [params.zipcode]
            }
        });
    }

    async getZipcode(params: RequestGetZipcode): Promise<string[]> {
        const zipcodes = await this.prisma.zipcodes.findFirst({
            where: { email: params.email }
        });

        if (!zipcodes)
            return null;

        return zipcodes.zipcodes;
    }
}