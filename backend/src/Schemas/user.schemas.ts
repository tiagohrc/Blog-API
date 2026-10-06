import z from "zod";
import { paginationSchema } from "./common.schemas.js";

const roleSchema = z.enum(['ADMIN', 'USER']);

export const usernameParamsSchema = z.object({username: z.string().min(3)});

export const createUserSchema = z.object({
    username: z.string().min(3,"Username é obrigatório ter pelo menos 3 caracteres"),
    password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres"),
    email: z.email(),
    role: roleSchema.default('USER')
}).strict();

export const updateUserSchema = z.object({
    username: z.string().min(3,"Username é obrigatório ter pelo menos 3 caracteres").optional(),
    email: z.string().email().optional(),
    password: z.string().min(6, "Senha precisa ter no mínimo 6 caracteres").optional(),
    role: roleSchema.optional()
}).strict();


export const userFilterSchema = paginationSchema.extend({
    username: z.string().optional(),
});


export const userCreateSwaggerSchema = {
    tags: ["Users"],
    summary: "Registra um novo usuário (público)",
    body: {
        type: "object",
        required: ["username", "email", "password", "role"],
        properties: {
            username: { type: "string", minLength: 3 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["ADMIN", "USER"] }
        }
    },
    response: {
        201: { $ref: "User#" },
        400: { $ref: "ErrorResponse#" }
    }
} as const;

export const userGetSwaggerSchema = {
    tags: ["Users"],
    summary: "Lista usuários, com paginação e filtro (somente ADMIN)",
    security: [{ bearerAuth: [] }],
    querystring: {
        type: "object",
        properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 10 },
            username: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: { type: "array", items: { $ref: "User#" } },
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
        },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" }
    }
} as const;


export const userGetByIdSwaggerSchema = {
    tags: ["Users"],
    summary: "Busca um usuário pelo id (dono ou ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    response: {
        200: { $ref: "User#" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
} as const;

export const userUpdateSwaggerSchema = {
    tags: ["Users"],
    summary: "Atualiza um usuário (dono ou ADMIN)",
    security: [{ bearerAuth: [] }],
    params: {
        type: "object",
        properties: { id: { type: "number" } }
    },
    body: {
        type: "object",
        properties: {
            username: { type: "string", minLength: 3 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["ADMIN", "USER"] }
        }
    },
    response: {
        200: { $ref: "User#" },
        401: { $ref: "ErrorResponse#" },
        403: { $ref: "ErrorResponse#" },
        404: { $ref: "ErrorResponse#" }
    }
} as const;

export const userDeleteSwaggerSchema = {
    tags: ["Users"],
    summary: "Deleta a própria conta",
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


export type UserFilterParams = z.infer<typeof userFilterSchema>;