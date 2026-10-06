import { UserPrismaRepository } from "../repositories/prisma.repositories/user.prisma.repositories.js";
import { LoginUseCase } from "../usescases/user.usecases/login.user.js"

export function makeLoginUseCase() {
    const userRepository = new UserPrismaRepository();
    return new LoginUseCase(userRepository);
}