import { NotFoundError, ValidationError } from "../../errors/app.errors.js";
import type { CommentRepository, IUpdateComment } from "../../repositories/interfaces/comment.js";

export class UpdateCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async update(id: number, data: IUpdateComment, requesterId: number, requesterRole: string) {
        const comment = await this.commentRepository.findById(id);

        if (!comment) {
            throw new NotFoundError("Comentário não encontrado");
        }

        if (comment.userId !== requesterId && requesterRole !== "ADMIN") {
            throw new ValidationError("Você não tem permissão para editar esse comentário");
        }

        return await this.commentRepository.update(id, data);
    }
}