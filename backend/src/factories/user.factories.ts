import { CommentPrismaRepository } from "../repositories/prisma.repositories/comment.prisma.repositories.js";
import { UserPrismaRepository } from "../repositories/prisma.repositories/user.prisma.repositories.js";
import { CreateUserUseCase } from "../usescases/user.usecases/create.user.js";
import { DeleteUserUseCase } from "../usescases/user.usecases/delete.user.js";
import { FindAllUserUseCase } from "../usescases/user.usecases/findAll.user.js";
import { FindByIdUserUseCase } from "../usescases/user.usecases/findById.user.js";
import { FindByUsernameUserUseCase } from "../usescases/user.usecases/findByUsername.user.js";
import { UpdateUserUseCase } from "../usescases/user.usecases/update.user.js";

export function makeCreateUserUseCase () {
    const userRepository = new UserPrismaRepository();
    return new CreateUserUseCase(userRepository);
}

export function makeUpdateUserUseCase() {
    const userRepository = new UserPrismaRepository();
    return new UpdateUserUseCase(userRepository);
}

export function makeDeleteUserUseCase() {
    const userRepository = new UserPrismaRepository();
    const commentRepository = new CommentPrismaRepository();
    return new DeleteUserUseCase(userRepository, commentRepository);
}

export function makeFindAllUserUseCase() {
    const userRepository = new UserPrismaRepository();
    return new FindAllUserUseCase(userRepository);
}

export function makeFindByIdUserUseCase() {
    const userRepository = new UserPrismaRepository();
    return new FindByIdUserUseCase(userRepository);
}

export function makeFindByUsernameUserUseCase() {
    const userRepository = new UserPrismaRepository();
    return new FindByUsernameUserUseCase(userRepository);
}