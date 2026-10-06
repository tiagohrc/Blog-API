import { prisma } from "../../libs/prisma.js";
import type { UserFilterParams } from "../../Schemas/user.schemas.js";
import type { ICreateUser, IUser, IUpdateUser, UserRepository, IUserPublic } from "../interfaces/user.js";

export class UserPrismaRepository implements UserRepository {
    async create(data: ICreateUser): Promise<IUserPublic> {
        const createResult = await prisma.user.create({
            data: {
                username:data.username,
                password: data.password,
                email:data.email,
                role:data.role
            },
            omit: {password:true}
        })
        return createResult;
    }

    async findAll(params: UserFilterParams): Promise<{ users: IUserPublic[]; total: number }> {
        const { page, limit, username } = params;
        const skip = (page - 1) * limit;

        const where = {
            ...(username && { username: { contains: username, mode: "insensitive" as const } }),
        };

        const [users, total] = await Promise.all([
            prisma.user.findMany({ where, skip, take: limit, omit: { password: true } }),
            prisma.user.count({ where }),
        ]);

        return { users, total };
    }

    async findById(id: number): Promise<IUserPublic | null> {
        return await prisma.user.findUnique({where: {id}, omit: { password: true }});
    }
    
    async findByUsername(username: string) {
        return await prisma.user.findUnique({where: {username}});
    }
    
    async update(id: number, data: IUpdateUser): Promise<IUserPublic | null> {
    return await prisma.user.update({
        where: { id },
        data: {
            ...(data.username !== undefined && { username: data.username }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.role !== undefined && { role: data.role }),
            ...(data.password !== undefined && { password: data.password }),
        },
        omit: { password: true }
    })
}
    
    async delete(id: number) {
        try{
            const deletedUser = await prisma.user.delete({where: {id}});
            return true;
        } catch(error) {
            if(error) {
                return false;
                
            }
            throw new Error;
        }
    }

}
