import { AlreadyExistError } from "../../errors/app.errors.js";
import type { ArticleRepository, IArticle, ICreateArticle } from "../../repositories/interfaces/article.js";

export class CreateArticleUseCase {
    constructor(private ArticleRepository: ArticleRepository) {}

    async create(data: ICreateArticle): Promise<IArticle> {
        const hasArticle = await this.ArticleRepository.findByTitle(data.title);
        if(hasArticle) {
            throw new AlreadyExistError("Artigo já existente");
        }
        return this.ArticleRepository.create(data);
    }
}