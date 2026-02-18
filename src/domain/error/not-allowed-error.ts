export class NotAllowedError extends Error {
    constructor() {
        super('Erro ao acessar endpoint');
        this.name = 'NotAllowedError';
    };
};