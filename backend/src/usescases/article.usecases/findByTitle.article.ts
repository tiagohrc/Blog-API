import { NotFoundError } from "../../errors/app.errors.js";
import type { ArticleRepository, IArticle } from "../../repositories/interfaces/article.js";

export class FindByIdArticleUseCase{
    constructor(private articleRepository: ArticleRepository) {}

    async findByTitle(title: string): Promise<IArticle> {
        const article = await this.articleRepository.findByTitle(title);
        
        if(!article) {
            throw new NotFoundError("Artigo não encontrado");
        }

        return article;
    }
}