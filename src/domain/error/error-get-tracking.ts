export class ErrorGetTracking extends Error {
    constructor() {
        super('Error ao carregar o código de rastreio');
        this.name = 'ErrorGetTracking';
    }
}