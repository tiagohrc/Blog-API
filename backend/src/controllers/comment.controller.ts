import type { FastifyRequest, FastifyReply } from "fastify";
import { commentByUserFilterSchema, createCommentSchema, findAllCommentQuerySchema, updateCommentSchema } from "../Schemas/comment.schemas.js"
import {
    makeCreateCommentUseCase,
    makeDeleteCommentUseCase,
    makeFindAllCommentUseCase,
    makeFindByIdCommentUseCase,
    makeFindByUserUseCase,
    makeUpdateCommentUseCase
} from "../factories/comment.factories.js";
import { idParamsSchema } from "../Schemas/common.schemas.js";
import { StatusCodes } from "http-status-codes";

export async function createComment(request: FastifyRequest, reply: FastifyReply) {
    const data = createCommentSchema.parse(request.body);
    const createCommentUseCase = makeCreateCommentUseCase();
    const comment = await createCommentUseCase.create(data);
    return reply.code(StatusCodes.CREATED).send(comment);
}

export async function updateComment(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = updateCommentSchema.parse(request.body);
    const updateCommentUseCase = makeUpdateCommentUseCase();
    const comment = await updateCommentUseCase.update(
        Number(id),
        result,
        request.user.id,
        request.user.role
    );
    return reply.code(StatusCodes.OK).send(comment);

}

export async function deleteComment(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamsSchema.parse(request.params);

    const deleteCommentUseCase = makeDeleteCommentUseCase();
    await deleteCommentUseCase.execute(id, request.user.id, request.user.role);
    return reply.code(StatusCodes.NO_CONTENT).send();
}

export async function findAllComment(request: FastifyRequest, reply: FastifyReply) {
    const query = findAllCommentQuerySchema.parse(request.query);   
    const findAllCommentUseCase = makeFindAllCommentUseCase();
    const comments = await findAllCommentUseCase.findAll(query);
    return reply.code(StatusCodes.OK).send(comments);
}

export async function findByIdComment(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamsSchema.parse(request.params)
    const findByIdCommentUseCase = makeFindByIdCommentUseCase();
    const comment = await findByIdCommentUseCase.findById(id);
    return reply.code(StatusCodes.OK).send(comment);
}

export async function findByUserIdComment(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as { userId: string };
    const filters = commentByUserFilterSchema.parse(request.query);

    const findByUserUseCase = makeFindByUserUseCase();
    const result = await findByUserUseCase.findByUser(Number(userId), filters);
    return reply.code(StatusCodes.OK).send(result);
}

