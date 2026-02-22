import { RemoteZipcode } from "../../../data/use-cases/remote-zipcode";
import { makeBdKnexClient } from "../bdClient/bd-prisma-client";
import { makeUuidGuid } from "../guid/uuid-guid";
import { makeAxiosHttpClient } from "../http/axios-http-client";

export const makeRemoteZipcode = (): RemoteZipcode => new RemoteZipcode(
    makeBdKnexClient(),
    makeAxiosHttpClient(),
    makeUuidGuid()
)