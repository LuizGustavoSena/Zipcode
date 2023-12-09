import { RemoteZipcode } from "../../../data/use-cases/remote-zipcode";
import { makeBdPrimaClient } from "../bdClient/bd-prisma-client";
import { makeAxiosHttpClient } from "../http/axios-http-client";

export const makeRemoteZipcode = (): RemoteZipcode => new RemoteZipcode(
    makeBdPrimaClient(),
    makeAxiosHttpClient()
)