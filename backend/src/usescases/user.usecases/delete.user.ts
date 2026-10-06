import { ForbiddenError, NotFoundError } from "../../errors/app.errors.js";
import type { CommentRepository } from "../../repositories/interfaces/comment.js";
import type { UserRepository } from "../../repositories/interfaces/user.js";

export class DeleteUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private commentRepository: CommentRepository
    ) {}

    async execute(id: number): Promise<boolean> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundError("Usuário não encontrado");
        }

        if (user.role === "ADMIN") {
            throw new ForbiddenError("Não é possível excluir uma conta de administrador");
        }

        const userComments = await this.commentRepository.findAllByUser(id)
        const commentIds = userComments.map(comment => comment.id);
        await this.commentRepository.deleteMany(commentIds);

        const userDeleted = await this.userRepository.delete(id);
        return userDeleted;
    }
}