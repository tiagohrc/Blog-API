
import type { FastifyReply, FastifyRequest } from "fastify";
import { idParamsSchema } from "../Schemas/common.schemas.js";
import { makeCreateUserUseCase, makeDeleteUserUseCase, makeFindAllUserUseCase, makeFindByIdUserUseCase, makeFindByUsernameUserUseCase, makeUpdateUserUseCase } from "../factories/user.factories.js";
import { StatusCodes } from "http-status-codes";
import { createUserSchema, updateUserSchema, userFilterSchema, usernameParamsSchema } from "../Schemas/user.schemas.js";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
    const user = createUserSchema.parse(request.body);
    const createUserUseCase = makeCreateUserUseCase();
    await createUserUseCase.create(user);
    return reply.status(StatusCodes.CREATED).send(user) 
}

export async function findAllUser(request: FastifyRequest, reply: FastifyReply) {
    const filters = userFilterSchema.parse(request.query);
    const findAllUser = makeFindAllUserUseCase();
    const users = await findAllUser.findAll(filters);
    return reply.status(StatusCodes.OK).send(users);
}

export async function findUserById(request: FastifyRequest, reply: FastifyReply) {
    const {id} = idParamsSchema.parse(request.params);
    const findUserById = makeFindByIdUserUseCase();
    const user = await findUserById.findById(id);
    return reply.status(StatusCodes.OK).send(user);
} 
export async function findByUsername(request: FastifyRequest, reply: FastifyReply){
    const {username} = usernameParamsSchema.parse(request.params);
    const findUserByUsername = makeFindByUsernameUserUseCase();
    const user = await findUserByUsername.findByUsername(username);
    return reply.status(StatusCodes.OK).send(user);
}
export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamsSchema.parse(request.params);
    const data = updateUserSchema.parse(request.body);
    const { id: requesterId, role: requesterRole } = request.user;
    const updateUserUseCase = makeUpdateUserUseCase();
    const updatedUser = await updateUserUseCase.update(id, data, requesterId, requesterRole);
    return reply.status(StatusCodes.OK).send(updatedUser);
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
    const { id } = idParamsSchema.parse(request.params);
    const deleteUserUseCase = makeDeleteUserUseCase();
    await deleteUserUseCase.execute(id);
    return reply.status(StatusCodes.NO_CONTENT).send();
}
