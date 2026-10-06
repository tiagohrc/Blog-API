import { NotFoundError, ValidationError } from "../../errors/app.errors.js";
import type { CommentRepository } from "../../repositories/interfaces/comment.js";

export class DeleteCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async execute(id: number, requesterId: number, requesterRole: string): Promise<boolean> {
        const comment = await this.commentRepository.findById(id);

        if (!comment) {
            throw new NotFoundError("Comentário não encontrado");
        }

        if (comment.userId !== requesterId && requesterRole !== "ADMIN") {
            throw new ValidationError("Você não tem permissão para deletar esse comentário");
        }

        await this.commentRepository.delete(id);
        return true;
    }
}