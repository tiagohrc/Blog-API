// middlewares/verifyOwnerOrAdmin.middleware.ts
import { USER_ROLE } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { StatusCodes } from "http-status-codes";

export async function verifyOwnerOrAdmin(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const isOwner = request.user.id === Number(id);
    const isAdmin = request.user.role === USER_ROLE.ADMIN;

    if (!isOwner && !isAdmin) {
        return reply.status(StatusCodes.FORBIDDEN).send({ error: "Você não tem permissão para acessar esse recurso" });
    }
}