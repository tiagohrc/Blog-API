import { NotFoundError } from "../../errors/app.errors.js";
import type { ArticleRepository, IUpdateArticle } from "../../repositories/interfaces/article.js";

export class UpdateArticleUseCase {
    constructor(private articleRepository: ArticleRepository) {}

    async update(id: number, data: IUpdateArticle) {
        const article = await this.articleRepository.update(id, data);
        if(!article) {
            throw new NotFoundError("Artigo não encontrado");
        }
        
        return article;
    }
}