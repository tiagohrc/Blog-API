import type { ArticleRepository } from "../../repositories/interfaces/article.js";

export class FindAllArticleUseCase {
    constructor(private articleRepository: ArticleRepository) {}

    async findAll(params: { page: number; limit: number; title?: string | undefined; isDestaque?: boolean | undefined}) {
        const { articles, total } = await this.articleRepository.findAll(params);

        return {
            data: articles,
            meta: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages: Math.ceil(total / params.limit),
            },
        };
    }
}