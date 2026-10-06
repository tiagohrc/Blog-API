import { env } from "../../env/index.js";
import type { ICreateUser, IUser, IUserPublic, UserRepository } from "../../repositories/interfaces/user.js";
import bcrypt from 'bcrypt';

export class CreateUserUseCase {
    constructor(private userRepository: UserRepository) {};

    async create(data: ICreateUser): Promise<IUserPublic> {
        const hashedPassword = await bcrypt.hash(data.password, env.HASH_SALT_ROUNDS);

        const hasUser = await this.userRepository.findByUsername(data.username)
        if(hasUser) {
            throw new Error("Usuário já existente")
        }
        return await this.userRepository.create({
        ...data, password:hashedPassword});
    }
}