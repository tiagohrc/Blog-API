import { ArticlePrismaRepository } from "../repositories/prisma.repositories/article.prisma.repositories.js";
import { CommentPrismaRepository } from "../repositories/prisma.repositories/comment.prisma.repositories.js";
import { CreateArticleUseCase } from "../usescases/article.usecases/create.article.js";
import { DeleteArticleUseCase } from "../usescases/article.usecases/delete.article.js";
import { FindAllArticleUseCase } from "../usescases/article.usecases/findAll.article.js";
import { FindByIdArticleUseCase } from "../usescases/article.usecases/findById.article.js";
import { UpdateArticleUseCase } from "../usescases/article.usecases/update.article.js";

export function makeCreateArticleUseCase () {
    const articleRepository = new ArticlePrismaRepository();
    return new CreateArticleUseCase(articleRepository);
}

export function makeUpdateArticleUseCase() {
    const articleRepository = new ArticlePrismaRepository();
    return new UpdateArticleUseCase(articleRepository);
}

export function makeDeleteArticleUseCase() {
    const articleRepository = new ArticlePrismaRepository();
    const commentRepository = new CommentPrismaRepository();
    return new DeleteArticleUseCase(articleRepository, commentRepository);
}

export function makeFindAllArticleUseCase() {
    const articleRepository = new ArticlePrismaRepository();
    return new FindAllArticleUseCase(articleRepository);
}

export function makeFindByIdArticleUseCase() {
    const articleRepository = new ArticlePrismaRepository();
    return new FindByIdArticleUseCase(articleRepository);
}

export function makeFindByTitleArticleUseCase() {
    const articleRepository = new ArticlePrismaRepository();
    return new FindByIdArticleUseCase(articleRepository);
}

