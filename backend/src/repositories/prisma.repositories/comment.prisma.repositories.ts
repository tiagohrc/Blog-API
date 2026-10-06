import { prisma } from "../../libs/prisma.js";
import type { CommentByUserFilterParams } from "../../Schemas/comment.schemas.js";
import type { IArticle } from "../interfaces/article.js";
import type { CommentRepository, IComment, ICreateComment, IUpdateComment } from "../interfaces/comment.js";
 
export class CommentPrismaRepository implements CommentRepository {
    async create(data: ICreateComment): Promise<IComment> {
        const createComment = await prisma.comment.create({
            data: {
                userId: data.userId,
                articleId:data.articleId,
                content:data.content
            }
        })
        return createComment;
    }
    
    async findAll(): Promise<IComment[]> {
        return await prisma.comment.findMany();
    }

   async findByArticle(articleId: number): Promise<number[]> {
    const comments = await prisma.comment.findMany({ where: { articleId: articleId } });
    return comments.map(comment => comment.id);
}

    async findById(id: number): Promise<IComment | null> {
        return await prisma.comment.findUnique({ where: {id}});
    }

    async findByUser(userId: number, params: CommentByUserFilterParams) {
        const { page, limit, content } = params;
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(content && { content: { contains: content, mode: "insensitive" as const } }),
        };

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
            prisma.comment.count({ where }),
        ]);

        return { comments, total };
    }

    async findAllByUser(userId: number): Promise<IComment[]> {
        return await prisma.comment.findMany({ where: { userId } });
    }

    async update(id: number, data: IUpdateComment) {
        return await prisma.comment.update({
            where: {
                id
            },
            data: {
            ...(data.userId !== undefined && { userId: data.userId }),
            ...(data.articleId !== undefined && { articleId: data.articleId }),
            ...(data.content !== undefined && { content: data.content }),
            },
        })
    }
    async delete(id: number): Promise<boolean> {
        try {
            const deletedComment = await prisma.comment.delete({where: {id}});
                return true;
            } catch(error) {
                throw new Error;
            }
    }

    async deleteMany(id: number[]): Promise<number> {
        const deletedComment = await prisma.comment.deleteMany({ where: {id: {in: id}}})
            return deletedComment.count
            
    }
}