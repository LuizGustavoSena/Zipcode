import { faker } from '@faker-js/faker';
import { RequestInsertZipcode } from "../../../src/domain/models";

export const makeRequestCreateZipcode = (params?: { email?: string, zipcode?: string }): RequestInsertZipcode => {
    return {
        email: params?.email ? params.email : faker.internet.email(),
        zipcode: params?.zipcode ? params.zipcode : faker.word.words()
    }
}