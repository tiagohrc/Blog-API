import { NotFoundError, ValidationError } from "../../errors/app.errors.js";
import type { CommentRepository, IComment, ICreateComment } from "../../repositories/interfaces/comment.js";

export class CreateCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async create(data: ICreateComment): Promise<IComment> {
        const qtdComment = await this.commentRepository.findAllByUser(data.userId);
        if(qtdComment.length >= 3) {
            throw new ValidationError("Só é possível fazer no máximo 3 comentários por postagem");
        }
        return await this.commentRepository.create(data)
    }
}