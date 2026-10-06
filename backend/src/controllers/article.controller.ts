import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { createArticleSchema, updateArticleSchema } from "../Schemas/article.schemas.js";
import { makeCreateArticleUseCase, makeDeleteArticleUseCase, makeFindAllArticleUseCase, makeFindByIdArticleUseCase, makeUpdateArticleUseCase } from "../factories/article.factories.js";
import { StatusCodes } from "http-status-codes";
import { articleFilterSchema, idParamsSchema } from "../Schemas/common.schemas.js";

export async function createArticle(request: FastifyRequest, reply: FastifyReply) {
    const data = createArticleSchema.parse(request.body);
    
    const createArticleUsecase = makeCreateArticleUseCase();
    const article = await createArticleUsecase.create({
        title: data.title,
        content:data.content,
        about:data.about,
        tempoLeitura:data.tempoLeitura,
        isDestaque:data.isDestaque
    })
    return reply.status(StatusCodes.CREATED).send(article);

}

export async function findAllArticle(request: FastifyRequest, reply: FastifyReply) {
    const filters = articleFilterSchema.parse(request.query);
    const FindAllArticleUseCase = makeFindAllArticleUseCase();
    const articles = await FindAllArticleUseCase.findAll(filters);
    return reply.status(StatusCodes.OK).send(articles)
}

export async function findByIdArticle(request: FastifyRequest, reply: FastifyReply) {
    const {id} = idParamsSchema.parse(request.params);
    const FindByIdArticleUseCase = makeFindByIdArticleUseCase();
    const article = await FindByIdArticleUseCase.findById(id);
    return reply.status(StatusCodes.OK).send(article);
}

export async function updateArticle(request: FastifyRequest, reply: FastifyReply) {
    const data = updateArticleSchema.parse(request.body);
    const { id } = idParamsSchema.parse(request.params);

    if (Object.keys(data).length === 0) {
        return reply.status(StatusCodes.BAD_REQUEST).send({ message: 'Nenhum campo para atualizar.' });
    }

    const updateArticleUseCase = makeUpdateArticleUseCase();
    const updatedArticle = await updateArticleUseCase.update(id, data);
    return reply.status(StatusCodes.OK).send(updatedArticle);
}

export async function deleteArticle(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamsSchema.parse(request.params);
    const deleteArticleUseCase = makeDeleteArticleUseCase();
    await deleteArticleUseCase.execute(id);
    return reply.status(StatusCodes.NO_CONTENT).send();
}