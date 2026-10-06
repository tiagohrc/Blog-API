import type { FastifyRequest, FastifyReply } from "fastify";
import { StatusCodes } from "http-status-codes";
import { loginSchema } from "../Schemas/auth.schemas.js";
import { makeLoginUseCase } from "../factories/auth.factories.js";
import type { USER_ROLE } from "@prisma/client";

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = loginSchema.parse(request.body);

            const loginUseCase = makeLoginUseCase();
            const user = await loginUseCase.execute(data);

            const token = await reply.jwtSign({
                id: user.id,
                role: user.role
            }, {expiresIn: '10m'});

            const refreshToken = await reply.jwtSign({
                id: user.id,
                role: user.role
            }, {expiresIn: '7d'})

            return reply
                .setCookie('refreshToken', refreshToken, {
                    path: '/',
                    secure: true, 
                    httpOnly: true,
                    sameSite: 'strict',
                })
                .code(StatusCodes.OK)
                .send({ token });
        } catch (error) {
            return reply.code(StatusCodes.UNAUTHORIZED).send({ error: "Usuário ou senha inválidos" });
        }
    }

    async refresh(request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify({ onlyCookie: true });

            const { id, role } = request.user as { id: number; role: USER_ROLE };

            const token = reply.jwtSign({ id, role }, { expiresIn: '10m' });

            return reply.code(StatusCodes.OK).send({ token });
        } catch (error) {
            return reply
                .code(StatusCodes.UNAUTHORIZED)
                .send({ error: "Sessão expirada. Faça login novamente." });
        }
    }
}