import { faker } from '@faker-js/faker';
import { RequestInsertZipcode } from "../../../src/domain/models";

export const makeRequestCreateZipcode = (params?: { email?: string, code?: string }): RequestInsertZipcode => {
    return {
        email: params?.email ? params.email : faker.internet.email(),
        code: params?.code ? params.code : faker.word.words()
    }
}