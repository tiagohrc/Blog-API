import bcrypt from "bcrypt";
import type { IUpdateUser, UserRepository } from "../../repositories/interfaces/user.js";
import { NotFoundError, ForbiddenError } from "../../errors/app.errors.js";
import { env } from "../../env/index.js";
import { USER_ROLE } from "@prisma/client";


export class UpdateUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async update(id: number, data: IUpdateUser, requesterId: number, requesterRole: string) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }

        const isOwner = id === requesterId;
        const isAdmin = requesterRole === USER_ROLE.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new ForbiddenError("Você não tem permissão para editar esse usuário");
        }

        if (data.role !== undefined && !isAdmin) {
            throw new ForbiddenError("Você não tem permissão para alterar o role");
        }

        const updateData = { ...data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, env.HASH_SALT_ROUNDS);
        }

        return await this.userRepository.update(id, updateData);
    }
}