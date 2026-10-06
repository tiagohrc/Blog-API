import type { CommentRepository } from "../../repositories/interfaces/comment.js";
import type { CommentByUserFilterParams } from "../../Schemas/comment.schemas.js";

export class FindByUserUseCase {
    constructor(private commentRepository: CommentRepository) {}

    async findByUser(userId: number, params: CommentByUserFilterParams) {
        const { comments, total } = await this.commentRepository.findByUser(userId, params);

        return {
            data: comments,
            meta: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages: Math.ceil(total / params.limit),
            },
        };
    }
}