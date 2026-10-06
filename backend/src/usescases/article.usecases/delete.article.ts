import { NotFoundError } from "../../errors/app.errors.js";
import type { ArticleRepository, IArticle } from "../../repositories/interfaces/article.js";
import type { CommentRepository } from "../../repositories/interfaces/comment.js";

export class DeleteArticleUseCase {
    constructor(private articleRepository: ArticleRepository, private commentRepository: CommentRepository) {}

    async execute(id: number): Promise<boolean> {
        const article = await this.articleRepository.findById(id);
        if(!article) {
            throw new NotFoundError("Artigo não encontrado");
        }
        const articleComments = await this.commentRepository.findByArticle(article.id)
        await this.commentRepository.deleteMany(articleComments)
        
        const articleDeleted = await this.articleRepository.delete(id)
        
        return articleDeleted;
    } 
}