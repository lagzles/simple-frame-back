import { z } from "zod";

export const frameGenerateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  spanList: z.array(z.number().positive()).min(1),
  freeHeight: z.number().positive(),
  ridgeX: z.number().positive().optional(),
  roofSlopePercent: z.number().min(0).max(100),
  influenceWidth: z.number().positive(),
  minimumWebHeight: z.number().positive().optional(),
  hasSteelColumns: z.boolean().default(true),
  roofType: z.enum(["single_slope", "double_slope"]),
});

export type FrameGenerateInput = z.infer<typeof frameGenerateSchema>;
