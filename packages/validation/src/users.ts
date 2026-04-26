import { z } from "zod";

export const devicePlatformSchema = z.enum(["ios", "android", "web"]);

export const updateDeviceTokenSchema = z.object({
  pushToken: z.string().min(1),
  platform: devicePlatformSchema,
  timezone: z.string().min(1).max(100).optional(),
});

export const updateOnboardingStatusSchema = z.object({
  completed: z.boolean(),
});

export const onboardingStatusResponseSchema = z.object({
  hasCompletedOnboarding: z.boolean(),
  onboardingCompletedAt: z.string().min(1).nullable(),
});

export type UpdateDeviceTokenInput = z.infer<typeof updateDeviceTokenSchema>;
export type OnboardingStatusResponse = z.infer<
  typeof onboardingStatusResponseSchema
>;
export type UpdateOnboardingStatusInput = z.infer<
  typeof updateOnboardingStatusSchema
>;
