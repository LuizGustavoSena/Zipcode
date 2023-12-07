import { BdClient } from "../../../data/protocols/bd";
import { BdPrismaClient } from "../../../infra/bdClient/bd-prisma-client";

export const makeBdPrimaClient = (): BdClient => new BdPrismaClient();