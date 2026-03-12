import { z } from "zod/v3";

export const createUrlSchema = z.object({
    link: z.string()
});

export type CreateLinkDTO = z.infer<typeof createUrlSchema>;