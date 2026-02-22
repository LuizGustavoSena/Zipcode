import { AppError } from "./app-error";

export class ErrorGetTracking extends AppError {
    constructor() {
        super({ message: 'Error ao carregar o código de rastreio', code: 'EXTERNAL_API_ERROR', statusCode: 500 });
        this.name = 'ErrorGetTracking';
    }
}