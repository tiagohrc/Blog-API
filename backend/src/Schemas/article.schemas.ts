import { z } from "zod"

export const createArticleSchema = z.object({
    title: z.string().min(5,"Título é obrigatório ter pelo menos 5 caracteres"),
    content: z.string().min(100),
    about: z.string().min(5),
    tempoLeitura: z.number().int().positive(),
    image: z.url().optional(),
    isDestaque: z.boolean()
}).strict()

export const updateArticleSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    about: z.string().optional(),
    comment: z.array(z.string()).optional(),
    tempoLeitura: z.number().int().positive().optional(),
    image: z.string().url().optional(),
    isDestaque: z.boolean().optional(),
})
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'Informe ao menos um campo para atualizar.',
    });


export const articleGetSwaggerSchema = {
    schema: {
        tags: ["Articles"],
        summary: "Lista artigos, com paginação e filtro",
        querystring: {
            type: "object",
            properties: {
                page: { type: "number", default: 1 },
                limit: { type: "number", default: 10 },
                title: { type: "string" },
                isDestaque: { type: "string", enum: ["true", "false"] }
            }
        },
        response: {
            200: {
                type: "object",
                properties: {
                    data: { type: "array", items: { $ref: "Article#" } },
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
    }
}

export const articleByIdGetSwaggerSchema = {
    schema: {
        tags: ["Articles"],
        summary: "Busca um artigo pelo id",
        params: {
            type: "object",
            properties: { id: { type: "number" } }
        },
        response: {
            200: { $ref: "Article#" },
            404: { $ref: "ErrorResponse#" }
        }
    }
}

export const createArticleSwaggerSchema = {
    tags: ["Articles"],
    summary: "Cria um artigo (somente ADMIN)",
    security: [{ bearerAuth: [] }],
    body: {
        type: "object",
        required: ["title", "content", "about", "tempoLeitura", "isDestaque"],
        properties: {
            title: { type: "string" },
            content: { type: "string" },
            about: { type: "string" },
            tempoLeitura: { type: "number" },
            isDestaque: { type: "boolean" },
        },
    },
    response: {
        201: { $ref: "Article#" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
    },
} as const;


export const updateArticleSwaggerSchema = {
    tags: ["Articles"],
    summary: "Atualiza um artigo (somente ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    body: {
        type: "object",
        properties: {
            title: { type: "string" },
            content: { type: "string" },
            about: { type: "string" },
            tempoLeitura: { type: "number" },
            isDestaque: { type: "boolean" }
        }
    },
    response: {
        200: { $ref: "Article#" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
} as const;

export const deleteArticleSwaggerSchema = {
    tags: ["Articles"],
    summary: "Deleta um artigo e seus comentários (somente ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    response: {
        200: { type: "boolean" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
}