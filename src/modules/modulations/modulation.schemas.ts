import { z } from "zod";

export const createModulationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  orderIndex: z.number().int().min(0),
  repeatCount: z.number().int().positive(),
  frameSpacing: z.number().positive(),
});

export type CreateModulationInput = z.infer<typeof createModulationSchema>;
