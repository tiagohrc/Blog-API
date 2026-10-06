import z from "zod";
import { paginationSchema } from "./common.schemas.js";

export const findAllCommentQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    userId: z.coerce.number().int().positive().optional(),
    articleId: z.coerce.number().int().positive(),
});

export const createCommentSchema = z.object({
    userId: z.number().int().positive(),
    articleId: z.number().int().positive(),
    content: z.string().min(4, "É necessário no mínimo 4 caracteres para fazer um comentário")
}).strict()

export const updateCommentSchema = z.object({
    userId: z.number().int().positive().optional(),
    articleId: z.number().int().positive().optional(),
    content: z.string().min(4, "É necessário no mínimo 4 caracteres para fazer um comentário").optional()
}).strict()


export const commentByUserFilterSchema = paginationSchema.extend({
    content: z.string().optional(),
});


export const commentGetSwaggerSchema = {
    tags: ["Comments"],
    summary: "Lista todos os comentários",
    response: {
        200: { type: "array", items: { $ref: "Comment#" } }
    }
} as const;

export const commentGetByIdSwaggerSchema = {
    tags: ["Comments"],
    summary: "Busca um comentário pelo id",
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    response: {
        200: { $ref: "Comment#" },
        404: { $ref: "ErrorResponse#" }
    }
} as const;

export const commentGetByUserIdSwaggerSchema = {
    tags: ["Comments"],
    summary: "Lista comentários de um usuário, com paginação e filtro",
    params: {
        type: "object",
        properties: { userId: { type: "number" } }
    },
    querystring: {
        type: "object",
        properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
            content: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: { type: "array", items: { $ref: "Comment#" } },
                meta: {
                    type: "object",
                    properties: {
                        page: { type: "number" },
                        limit: { type: "number" },
                        total: { type: "number" },
                        totalPages: { type: "number" }
                    }
                }
            }
        }
    }
} as const;

export const commentCreateSwaggerSchema = {
    tags: ["Comments"],
    summary: "Cria um comentário (usuário autenticado)",
    security: [{ bearerAuth: [] }],
    body: {
        type: "object",
        required: ["userId", "articleId", "content"],
        properties: {
            userId: { type: "number" },
            articleId: { type: "number" },
            content: { type: "string", minLength: 4 }
        }
    },
    response: {
        201: { $ref: "Comment#" },
        401: { $ref: "ErrorResponse#" },
        400: { $ref: "ErrorResponse#" }
    }
} as const


export const commentUpdateSwaggerSchema = {
    tags: ["Comments"],
    summary: "Atualiza um comentário (dono ou ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    body: {
        type: "object",
        properties: {
            content: { type: "string", minLength: 4 }
        }
    },
    response: {
        200: { $ref: "Comment#" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
} as const;


export const commentDeleteSwaggerSchema = {
    tags: ["Comments"],
    summary: "Deleta um comentário (dono ou ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    response: {
        204: { type: "null" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
}

export type CommentByUserFilterParams = z.infer<typeof commentByUserFilterSchema>;