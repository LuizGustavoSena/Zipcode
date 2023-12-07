import { faker } from '@faker-js/faker';
import { RequestInsertZipcode } from "../../../src/domain/models";

export const makeRequestCreateZipcode = (): RequestInsertZipcode => {
    return {
        email: faker.internet.email(),
        zipcode: faker.word.words()
    }
}