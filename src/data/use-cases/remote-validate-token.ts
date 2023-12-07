import { InvalidCredentialsError } from "../../domain/error/invalid-credentials-error";
import { ValidateToken } from "../../domain/use-cases";
import { ResponseValidate, Token } from "../protocols/token";

export class RemoteValidateToken implements ValidateToken {
    constructor(
        private token: Token
    ) { };

    validate(token: string): ResponseValidate {
        const validToken = this.token.validate(token);

        if (!validToken)
            throw new InvalidCredentialsError();

        return validToken;
    }
}