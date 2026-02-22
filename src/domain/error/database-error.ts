import { AppError } from "./app-error";

export class DatabaseError extends AppError {
    constructor(details?: unknown) {
        super({ message: 'Erro no banco de dados', statusCode: 500, code: 'DATABASE_ERROR', details });
        this.name = 'DatabaseError';
    }
}