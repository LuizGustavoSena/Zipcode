import { PrismaClient } from "@prisma/client";
import { BdClient, ResponseGetZipcode } from "../../data/protocols/bd";
import { RequestGetZipcode, RequestInsertZipcode } from "../../domain/models";

export class BdPrismaClient implements BdClient {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createZipcode(params: RequestInsertZipcode): Promise<void> {
        const haveZipcodes = await this.prisma.zipcodes.findFirst({
            where: {
                email: params.email
            }
        });

        if (haveZipcodes) {
            haveZipcodes.zipcodes.push(params.zipcode);

            this.prisma.zipcodes.update({
                where: { email: params.email },
                data: {
                    zipcodes: haveZipcodes.zipcodes
                }
            });

            return;
        }

        this.prisma.zipcodes.create({
            data: {
                email: params.email,
                zipcodes: [params.zipcode]
            }
        });
    }

    getZipcode(params: RequestGetZipcode): Promise<ResponseGetZipcode> {
        throw new Error("Method not implemented.");
    }
}