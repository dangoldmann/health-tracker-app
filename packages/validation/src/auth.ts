import { z } from "zod";

export const authProviderSchema = z.enum(["supabase", "clerk", "custom"]);

export const registerUserSchema = z.object({
  email: z.string().email(),
  provider: authProviderSchema,
  timezone: z.string().min(1).max(100),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
