import fastify from "fastify";
import { articleRoutes } from "./routes/article.routes.js";
import fastifyJwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";
import { StatusCodes } from "http-status-codes";
import { ForbiddenError, NotFoundError, ValidationError } from "./errors/app.errors.js";
import { ZodError } from "zod";
import rateLimit from '@fastify/rate-limit';
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastifyCookie from "@fastify/cookie";
import { env } from "./env/index.js";
import { userRoutes } from "./routes/user.routes.js";

export const app = fastify({
    logger: true
});



app.register(swagger, {
    openapi: {
        openapi: "3.0.0",
        info: {
            title: "Blog API",
            description: "API de um blog de Jornalismo com artigos, comentários e usuários",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
});

app.register(swaggerUi, {
    routePrefix: "/docs",
});


app.addSchema({
    $id: "Article",
    type: "object",
    properties: {
        id: { type: "number" },
        title: { type: "string" },
        content: { type: "string" },
        about: { type: "string" },
        tempoLeitura: { type: "number" },
        isDestaque: { type: "boolean" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
    }
});

app.addSchema({
    $id: "ErrorResponse",
    type: "object",
    properties: {
        error: { type: "string" }
    }
});

app.addSchema({
    $id: "Comment",
    type: "object",
    properties: {
        id: { type: "number" },
        userId: { type: "number" },
        articleId: { type: "number" },
        content: { type: "string" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
    }
});

app.addSchema({
    $id: "User",
    type: "object",
    properties: {
        id: { type: "number" },
        username: { type: "string" },
        email: { type: "string" },
        role: { type: "string", enum: ["ADMIN", "USER"] },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" }
    }
});

app.setErrorHandler((error, request, reply) => {
    if (error instanceof NotFoundError) {
        return reply.status(StatusCodes.NOT_FOUND).send({ error: error.message });
    }
    if (error instanceof ForbiddenError) {
        return reply.status(StatusCodes.FORBIDDEN).send({ error: error.message });
    }
    if (error instanceof ValidationError) {
        return reply.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
    if (error instanceof ZodError) {
        return reply.status(StatusCodes.BAD_REQUEST).send({ error: error.issues });
    }

    request.log.error(error);
    return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: "Erro interno no servidor" });
});


app.register(fastifyCookie)


app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
});

app.register(rateLimit, {
    global: false
});

app.register(userRoutes);
app.register(articleRoutes);
app.register(authRoutes);
app.register(commentRoutes);


app.register(helmet);

const isDevelopment = process.env.NODE_ENV !== "production";

app.register(cors, {
    origin: isDevelopment ? true : ["https://jornalismoblog.com.br"],
    credentials: true
});