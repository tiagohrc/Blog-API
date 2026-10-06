import type { IComment } from "./comment.js";

export interface IArticle {
    id: number;
    title: string;
    content: string;
    tempoLeitura: number;
    image: string | null;
    comment?: IComment[];
    isDestaque: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICreateArticle {
    title: string;
    content: string;
    about: string;
    tempoLeitura: number;
    image?: string;
    isDestaque: boolean;
}

export interface IUpdateArticle {
    title?: string | undefined;
    content?: string | undefined;
    about?: string | undefined;
    tempoLeitura?: number| undefined;
    image?: string| undefined;
    isDestaque?: boolean| undefined;
}

export interface ArticleRepository {
    create(data: ICreateArticle): Promise<IArticle>
    findAll(params: { page: number; limit: number; title?: string | undefined; isDestaque?: boolean | undefined }): Promise<{ articles: IArticle[]; total: number }>
    findById(id: number): Promise<IArticle | null>
    findByTitle(title:string): Promise<IArticle | null>
    update(id: number, data: IUpdateArticle): Promise<IArticle | null>
    delete(id: number): Promise<boolean>
}