import z from "zod";

export const idParamsSchema = z.object({id: z.coerce.number().int().positive()});

export const paginationSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export const articleFilterSchema = paginationSchema.extend({
    title: z.string().optional(),
    isDestaque: z
        .enum(["true", "false"])
        .transform(value => value === "true")
        .optional(),
});
