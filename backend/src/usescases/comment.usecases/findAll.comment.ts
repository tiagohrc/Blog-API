import type { CommentRepository, FindAllCommentParams, IComment } from "../../repositories/interfaces/comment.js";

export class FindAllCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async findAll(params: FindAllCommentParams): Promise<IComment[]> {
        return await this.commentRepository.findAll(params);
    }
}