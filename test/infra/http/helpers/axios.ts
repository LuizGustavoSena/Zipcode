import { faker } from '@faker-js/faker';
import axios from 'axios';

export const mockHttpResponse = (): any => ({
    data: faker.company,
    status: faker.number.int()
})

export const mockAxios = () => {
    const mockedAxios = axios as any;
    mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse())
    return mockedAxios
}