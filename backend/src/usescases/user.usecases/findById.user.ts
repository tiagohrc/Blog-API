import { NotFoundError } from "../../errors/app.errors.js";
import type { IUser, IUserPublic, UserRepository } from "../../repositories/interfaces/user.js";

export class FindByIdUserUseCase{
    constructor(private userRepository: UserRepository) {}

    async findById(id: number): Promise<IUserPublic> {
        const User = await this.userRepository.findById(id);
        
        if(!User) {
            throw new NotFoundError("Usuário não encontrado");
        }

        return User;
    }
}
