// usescases/auth.usecases/login.usecase.ts
import bcrypt from "bcrypt";
import type { UserRepository } from "../../repositories/interfaces/user.js";
import type { USER_ROLE } from "@prisma/client";

interface ILoginInput {
    username: string;
    password: string;
}

interface ILoginOutput {
    id: number;
    username: string;
    role: USER_ROLE;
}

export class LoginUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(data: ILoginInput): Promise<ILoginOutput> {
        const user = await this.userRepository.findByUsername(data.username);

        if (!user) {
            throw new Error("Usuário ou senha inválidos");
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);

        if (!passwordMatch) {
            throw new Error("Usuário ou senha inválidos");
        }

        return {
            id: user.id,
            username: user.username,
            role: user.role
        };
    }
}