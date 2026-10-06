import type { FastifyReply, FastifyRequest } from "fastify";
import { USER_ROLE } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

export function verifyRole(roles: USER_ROLE[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!roles.includes(request.user.role)) {
      return reply.status(StatusCodes.FORBIDDEN).send({
        message: "Acesso negado. Permissão insuficiente.",
      });
    }
  };
}