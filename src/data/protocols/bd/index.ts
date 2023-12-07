import { User } from "../../../domain/models";

export interface BdClient {
    createUser(params: User): Promise<ResponseCreateUser>;
    haveUser(params: RequestHaveUser): Promise<boolean>
};

export type RequestHaveUser = {
    email: string;
    password?: string;
}

export type ResponseCreateUser = {
    id: string,
    username: string,
    email: string,
    password: string
}