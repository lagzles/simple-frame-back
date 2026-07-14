import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(120),
  clientName: z.string().trim().max(120).optional(),
  description: z.string().trim().max(1000).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
