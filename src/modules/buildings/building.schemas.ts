import { z } from "zod";

export const roofTypeSchema = z.enum(["single_slope", "double_slope"]);

export const createBuildingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  frameSpacing: z.number().positive(),
  frameCount: z.number().int().positive(),
  freeHeight: z.number().positive(),
  roofType: roofTypeSchema,
  roofSlopePercent: z.number().min(0).max(100),
  projectId: z.string().uuid().optional(),
});

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
