import "@fastify/jwt";
import type { USER_ROLE } from "@prisma/client";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: number;
            role: USER_ROLE;
        };
        user: {
            id: number;
            role: USER_ROLE;
        };
    }
}