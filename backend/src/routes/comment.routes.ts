// routes/comment.routes.ts
import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {createComment, deleteComment, findAllComment, findByIdComment, findByUserIdComment, updateComment } from "../controllers/comment.controller.js";
import { commentCreateSwaggerSchema, commentDeleteSwaggerSchema, commentGetByIdSwaggerSchema, commentGetByUserIdSwaggerSchema, commentGetSwaggerSchema, commentUpdateSwaggerSchema } from "../Schemas/comment.schemas.js";

export async function commentRoutes(app: FastifyInstance) {
    app.get("/comments", {
            schema: commentGetSwaggerSchema
        }, findAllComment);
    
    
    app.get("/comments/:id", {
            schema: commentGetByIdSwaggerSchema
        }, findByIdComment);


    app.get("/comments/user/:userId",  {
            schema: commentGetByUserIdSwaggerSchema
        }, findByUserIdComment);

    app.post(
        "/comments",
        { preHandler: [authMiddleware],
            schema: commentCreateSwaggerSchema
         }, createComment
    );

    app.put(
        "/comments/:id",
        {
            preHandler: [authMiddleware],
            schema: commentUpdateSwaggerSchema
        }, updateComment
    );

    app.delete(
        "/comments/:id",
        { preHandler: [authMiddleware],
            schema: commentDeleteSwaggerSchema
         }, deleteComment
    );
}