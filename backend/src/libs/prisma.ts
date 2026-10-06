import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { env } from "../env/index.js";

const pool = new Pool({ 
  connectionString: env.DATABASE_URL 
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });