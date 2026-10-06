import type { CommentByUserFilterParams } from "../../Schemas/comment.schemas.js";

export interface IComment {
    id: number;
    userId: number;
    articleId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateComment {
    userId: number;
    articleId: number;
    content: string;
}

export interface IUpdateComment {
    userId?: number | undefined;
    articleId?: number | undefined;
    content?: string | undefined;
}

export interface FindAllCommentParams {
    page: number;
    limit: number;
    userId?: number | undefined;
    articleId: number | undefined;
}


export interface CommentRepository {
    create(data: ICreateComment): Promise<IComment>
    findAll(params: FindAllCommentParams): Promise<IComment[]>
    findById(id: number): Promise<IComment | null>
    findByArticle(articleId: number): Promise<number[]>
    findByUser(userId: number, params: CommentByUserFilterParams): Promise<{comments: IComment[]; total: number}>
    findAllByUser(userId: number): Promise<IComment[]>;
    update(id: number, data: IUpdateComment): Promise<IComment | null>
    delete(id: number): Promise<boolean>
    deleteMany(id: number[]): Promise<number>
}