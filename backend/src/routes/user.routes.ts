import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";
import { verifyOwnerOrAdmin } from "../middlewares/verifyOwnerOrAdmin.middleware.js";
import {
    createUser,
    findAllUser,
    findUserById,
    findByUsername,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";
import { USER_ROLE } from "@prisma/client";
import { userCreateSwaggerSchema, userDeleteSwaggerSchema, userGetByIdSwaggerSchema, userGetSwaggerSchema } from "../Schemas/user.schemas.js";
import { updateArticleSwaggerSchema } from "../Schemas/article.schemas.js";

export async function userRoutes(app: FastifyInstance) {
    app.post(
        "/users",
        {schema: userCreateSwaggerSchema},
        createUser
    );

    app.get(
        "/users",
        {
            preHandler: [authMiddleware, verifyRole([USER_ROLE.ADMIN])],
            schema: userGetSwaggerSchema
        },
        findAllUser
    );

    app.get(
        "/users/:id",
        {
            preHandler: [authMiddleware, verifyOwnerOrAdmin],
            schema: userGetByIdSwaggerSchema
        },
        findUserById
    );

    app.get(
        "/users/username/:username",
        {
            schema: {
                tags: ["Users"],
                summary: "Busca um usuário pelo username",
                params: {
                    type: "object",
                    properties: { username: { type: "string" } }
                },
                response: {
                    200: { $ref: "User#" },
                    404: { $ref: "ErrorResponse#" }
                }
            }
        },
        findByUsername
    );

    app.put(
        "/users/:id",
        {
            preHandler: [authMiddleware, verifyOwnerOrAdmin],
            schema: updateArticleSwaggerSchema
        },
        updateUser
    );

    app.delete(
        "/users/:id",
        {
            preHandler: [authMiddleware, verifyOwnerOrAdmin],
            schema: userDeleteSwaggerSchema
        },
        deleteUser
    );
}