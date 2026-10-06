import z from "zod";
import "dotenv/config";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    HOST: z.string().default("0.0.0.0"),
    HASH_SALT_ROUNDS: z.coerce.number().default(10),

    POSTGRES_HOST: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_DB: z.string(),
    POSTGRES_PORT: z.coerce.number(),

    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Variáveis de ambiente inválidas:");
    console.error(z.treeifyError(parsedEnv.error)); 
    process.exit(1);
}


export const env = parsedEnv.data;