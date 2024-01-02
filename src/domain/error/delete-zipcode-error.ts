export class DeleteZipcodeError extends Error {
    constructor() {
        super('Erro ao deletar código de rastreamento');
        this.name = 'DeleteZipcodeError';
    };
};