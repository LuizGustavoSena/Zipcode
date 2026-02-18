import { AppError } from "./app-error";

export class AuthenticatorError extends AppError {
    constructor() {
        super({
            message: 'Usuário não autorizado',
            statusCode: 401
        });
    };
}