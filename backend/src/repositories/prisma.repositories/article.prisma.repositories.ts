import type { ArticleRepository, IArticle, ICreateArticle, IUpdateArticle } from "../interfaces/article.js";
import { prisma } from "../../libs/prisma.js";

export class ArticlePrismaRepository implements ArticleRepository {
    async create(data: ICreateArticle): Promise<IArticle> {
        const createResult = await prisma.article.create({
            data: {
                title:data.title,
                content:data.content,
                about: data.about,
                tempoLeitura:data.tempoLeitura,
                image:data.image ?? null,
                isDestaque:data.isDestaque
            }
        })
        return createResult;
    }

     async update(id: number, data: IUpdateArticle): Promise<IArticle | null> {
        return await prisma.article.update({
            where: { 
                id,
            },
            data: {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.about !== undefined && { about: data.about }),
            ...(data.tempoLeitura !== undefined && { tempoLeitura: data.tempoLeitura }),
            ...(data.image !== undefined && { image: data.image}),
            ...(data.isDestaque !== undefined && { isDestaque: data.isDestaque }),

            },
        });
    }

    async delete(id: number): Promise<boolean> {
    try {
        await prisma.article.delete({
            where: { id }
        });
        
        return true;
    } catch (error) {
        if (error) {
            return false; 
        }
        throw error;
    }
}

    async findAll(params: { page: number; limit: number; title?: string; isDestaque?: boolean }) {
        const { page, limit, title, isDestaque } = params;
        const skip = (page - 1) * limit;

        const where = {
            ...(title && { title: { contains: title, mode: "insensitive" as const } }),
            ...(isDestaque !== undefined && { isDestaque }),
        };

        const [articles, total] = await Promise.all([
            prisma.article.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
            prisma.article.count({ where }),
        ]);

        return { articles, total };
    }

    async findById(id: number): Promise<IArticle | null> {
        return await prisma.article.findUnique({where: {id}})
    }

    async findByTitle(title: string): Promise<IArticle | null> {
        return await prisma.article.findFirst({where: {title}})
    }
}