import type { USER_ROLE } from "@prisma/client";
import type { UserFilterParams } from "../../Schemas/user.schemas.js";

export interface IUser {
    id: number;
    username: string;
    password: string;
    email: string;
    role: USER_ROLE;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateUser {
    username:string;
    password: string;
    email:string;
    role: USER_ROLE;
}

export interface IUpdateUser {
    username?: string | undefined;
    password?: string | undefined;
    email?: string | undefined;
    role?: USER_ROLE | undefined;
}

export type IUserPublic = Omit<IUser, "password">;

export interface UserRepository {
    create(data: ICreateUser): Promise<IUserPublic>;
    findAll(params: UserFilterParams): Promise<{users :IUserPublic[]; total: number}>; 
    findById(id: number): Promise<IUserPublic | null>;
    findByUsername(username: string): Promise<IUser | null>;
    update(id: number, data: IUpdateUser): Promise<IUserPublic | null>
    delete(id: number): Promise<boolean>
}