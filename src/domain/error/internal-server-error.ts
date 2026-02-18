import { AppError } from "./app-error";

export class InternalServerError extends AppError {
    constructor() {
        super({
            message: 'Erro inesperado no servidor',
            statusCode: 500
        });
    };
}