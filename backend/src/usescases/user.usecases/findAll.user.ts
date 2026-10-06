import type { UserRepository } from "../../repositories/interfaces/user.js";
import type { UserFilterParams } from "../../Schemas/user.schemas.js";

export class FindAllUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async findAll(params: UserFilterParams) {
        const { users, total } = await this.userRepository.findAll(params);

        return {
            data: users,
            meta: {
                page: params.page,
                limit: params.limit,
                total,
                totalPages: Math.ceil(total / params.limit),
            },
        };
    }
}