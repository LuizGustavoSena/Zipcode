export class ErrorGetTracking extends Error {
    constructor() {
        super('ErrorGetTracking');
        this.name = 'Error ao carregar o código de rastreio';
    }
}