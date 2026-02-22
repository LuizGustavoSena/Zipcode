import { GuidClient } from "../../../data/protocols/guid";
import { UuidGuid } from "../../../infra/guid/uuid-guid";

export const makeUuidGuid = (): GuidClient => new UuidGuid();