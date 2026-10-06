import { CommentPrismaRepository } from "../repositories/prisma.repositories/comment.prisma.repositories.js";
import { CreateCommentUseCase } from "../usescases/comment.usecases/create.comment.js";
import { DeleteCommentUseCase } from "../usescases/comment.usecases/delete.comment.js";
import { FindAllCommentUseCase } from "../usescases/comment.usecases/findAll.comment.js";
import { FindByIdCommentUseCase } from "../usescases/comment.usecases/findById.comment.js";
import { FindByUserUseCase } from "../usescases/comment.usecases/findByUser.comment.js";
import { UpdateCommentUseCase } from "../usescases/comment.usecases/update.comment.js";

export function makeCreateCommentUseCase () {
    const commentRepository = new CommentPrismaRepository();
    return new CreateCommentUseCase(commentRepository);
}

export function makeUpdateCommentUseCase() {
    const commentRepository = new CommentPrismaRepository();
    return new UpdateCommentUseCase(commentRepository);
}

export function makeDeleteCommentUseCase() {
    const commentRepository = new CommentPrismaRepository();
    return new DeleteCommentUseCase(commentRepository);
}

export function makeFindAllCommentUseCase() {
    const commentRepository = new CommentPrismaRepository();
    return new FindAllCommentUseCase(commentRepository);
}

export function makeFindByIdCommentUseCase() {
    const commentRepository = new CommentPrismaRepository();
    return new FindByIdCommentUseCase(commentRepository);
}

export function makeFindByUserUseCase() {
    const commentRepository = new CommentPrismaRepository();
    return new FindByUserUseCase(commentRepository);
}
