import { BdClient } from "../../../data/protocols/bd";
import { KnexBdClient } from "../../../infra/bdClient/bd-knex-client";

export const makeBdKnexClient = (): BdClient => new KnexBdClient();