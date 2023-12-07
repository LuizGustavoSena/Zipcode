import { InvalidCredentialsError } from "../../domain/error/invalid-credentials-error";
import { SameEmailError } from "../../domain/error/same-email-error";
import { RequestLoginAccount, ResponseLoginAccount } from "../../domain/models";
import { CreateAccount, LoginAccount, RequestCreateAccount } from "../../domain/use-cases";
import { BdClient } from "../protocols/bd";
import { Encrypt } from "../protocols/encrypt";
import { Token } from "../protocols/token";

export class RemoteAccount implements CreateAccount, LoginAccount {
    constructor(
        private bdClient: BdClient,
        private token: Token,
        private crypt: Encrypt
    ) { };

    async createAccount(params: RequestCreateAccount): Promise<void> {
        const email = this.crypt.encrypt(params.email);

        const haveEmail = await this.bdClient.haveUser({ email });

        if (haveEmail)
            throw new SameEmailError();

        await this.bdClient.createUser({
            email,
            password: this.crypt.encrypt(params.password),
            username: params.username
        });
    };

    async loginAccount(params: RequestLoginAccount): Promise<ResponseLoginAccount> {
        const haveUser = await this.bdClient.haveUser({
            email: this.crypt.encrypt(params.email),
            password: this.crypt.encrypt(params.password)
        });

        if (!haveUser)
            throw new InvalidCredentialsError();

        return this.token.generate({
            email: params.email
        });
    };
}