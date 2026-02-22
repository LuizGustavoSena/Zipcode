import { v4 as uuidv4 } from 'uuid';
import { GuidClient } from '../../data/protocols/guid';

export class UuidGuid implements GuidClient {
    constructor() { };

    generate = (): string => {
        return uuidv4();
    }
}