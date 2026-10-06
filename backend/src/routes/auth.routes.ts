import type { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller.js";
import { authSwaggerSchema, refreshSwaggerSchema } from "../Schemas/auth.schemas.js";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post(
        "/login",
        {
            config: {
                rateLimit: { max: 5, timeWindow: "1 minute" }
            },
            schema: authSwaggerSchema
        },
        authController.login.bind(authController)
    );
    app.post('/refresh', refreshSwaggerSchema, authController.refresh)
}