import { faker } from "@faker-js/faker"
import { GraphQlGetTracking } from "../../../src/domain/models/get-tracking"

export const makeResponseGetZipcode = (): GraphQlGetTracking => {
    return {
        data: {
            result: {
                lastStatus: faker.word.words(),
                trackingEvents: [
                    {
                        createdAt: faker.date.anytime().toString(),
                        from: faker.location.city(),
                        originalTitle: faker.word.words(),
                        to: faker.location.city(),
                        trackingCode: faker.string.uuid()
                    }
                ]
            }
        }
    }
}