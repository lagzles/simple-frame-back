import { z } from "zod";

export const createAnalysisJobSchema = z.object({
  projectId: z.string().uuid().optional(),
  buildingId: z.string().uuid(),
  frameId: z.string().uuid().optional(),
  options: z
    .object({
      runChecks: z.boolean().default(true),
      optimizeProfiles: z.boolean().default(false),
    })
    .default({ runChecks: true, optimizeProfiles: false }),
});

export type CreateAnalysisJobInput = z.infer<typeof createAnalysisJobSchema>;
