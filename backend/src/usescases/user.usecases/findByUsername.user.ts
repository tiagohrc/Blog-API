import { NotFoundError } from "../../errors/app.errors.js";
import type { IUser, IUserPublic, UserRepository } from "../../repositories/interfaces/user.js";

export class FindByUsernameUserUseCase{
    constructor(private userRepository: UserRepository) {}

    async findByUsername(username: string): Promise<IUserPublic> {
        const User = await this.userRepository.findByUsername(username);
        
        if(!User) {
            throw new NotFoundError("Usuário não encontrado");
        }

        return User;
    }
}