import { PrismaClient } from "@prisma/client";
import { BdClient, RequestHaveUser, ResponseCreateUser } from "../../data/protocols/bd";
import { User } from "../../domain/models";

export class BdPrismaClient implements BdClient {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createUser(params: User): Promise<ResponseCreateUser> {
        const { email, password, username } = params;

        const createUser = await this.prisma.users.create({
            data: {
                email,
                password,
                username
            }
        });

        return createUser;
    }

    async haveUser(params: RequestHaveUser): Promise<boolean> {
        const { email, password } = params;

        const results = await this.prisma.users.findFirst({
            where: {
                email,
                password
            }
        });

        return !!results;
    }
}