import { z } from "zod";

export const authCredentialsSchema = z.object({
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  password: z.string().min(6),
});

export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
