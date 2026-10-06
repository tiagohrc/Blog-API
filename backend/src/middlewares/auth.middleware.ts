import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch {
        return reply.code(StatusCodes.UNAUTHORIZED).send({ error: "Token inválido ou ausente" });
    }
}