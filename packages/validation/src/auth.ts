import { z } from "zod";

export const authProviderSchema = z.enum(["supabase", "clerk", "custom"]);
export const appUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  provider: authProviderSchema,
  timezone: z.string().min(1).max(100).nullable(),
  onboardingCompletedAt: z.string().min(1).nullable(),
  hasCompletedOnboarding: z.boolean(),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  provider: authProviderSchema,
  timezone: z.string().min(1).max(100),
});

export type AppUser = z.infer<typeof appUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
