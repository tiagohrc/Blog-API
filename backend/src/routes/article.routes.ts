import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    createArticle,
    findAllArticle,
    findByIdArticle,
    updateArticle,
    deleteArticle
} from "../controllers/article.controller.js";
import { verifyRole } from "../middlewares/rbac.middleware.js";
import { articleByIdGetSwaggerSchema, articleGetSwaggerSchema, createArticleSwaggerSchema, deleteArticleSwaggerSchema, updateArticleSwaggerSchema } from "../Schemas/article.schemas.js";
import { USER_ROLE } from "@prisma/client";

export async function articleRoutes(app: FastifyInstance) {
    app.get("/articles", articleGetSwaggerSchema, findAllArticle);
    app.get("/articles/:id", articleByIdGetSwaggerSchema, findByIdArticle);
    app.post(
        "/articles",
        { 
        preHandler: [authMiddleware, verifyRole([USER_ROLE.ADMIN])],
        schema: createArticleSwaggerSchema
        },
        createArticle
    );

    app.put(
        "/articles/:id",
        { 
            preHandler: [authMiddleware, verifyRole([USER_ROLE.ADMIN])],
            schema: updateArticleSwaggerSchema
         },
        updateArticle
    );

    app.delete(
        "/articles/:id",
        { preHandler: [authMiddleware, verifyRole([USER_ROLE.ADMIN])],
            schema: deleteArticleSwaggerSchema
         },
        deleteArticle
    );
}