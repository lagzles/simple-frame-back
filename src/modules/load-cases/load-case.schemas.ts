import { z } from "zod";

export const saveLoadCasesSchema = z.object({
  surfaceLoads: z.object({
    cp: z.number(),
    sc: z.number(),
    su: z.number(),
    cv: z.number(),
  }),
});

export type SaveLoadCasesInput = z.infer<typeof saveLoadCasesSchema>;
