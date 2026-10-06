import { NotFoundError } from "../../errors/app.errors.js";
import type { CommentRepository, IComment } from "../../repositories/interfaces/comment.js";

export class FindByIdCommentUseCase{
    constructor(private commentRepository: CommentRepository) {}

    async findById(id: number): Promise<IComment> {
        const comment = await this.commentRepository.findById(id);
        
        if(!comment) {
            throw new NotFoundError("Comentário não encontrado");
        }

        return comment;
    }
}