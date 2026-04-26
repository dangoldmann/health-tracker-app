import type { AppUser, OnboardingStatusResponse } from "@repo/validation";
import { Prisma } from "../generated/prisma/client";

export const appUserSelect = {
  authProvider: true,
  email: true,
  id: true,
  onboardingCompletedAt: true,
  timezone: true,
} satisfies Prisma.UserSelect;

type AppUserRecord = Prisma.UserGetPayload<{
  select: typeof appUserSelect;
}>;

type OnboardingStatusRecord = {
  onboardingCompletedAt: Date | null;
};

export function toAppUserResponse(user: AppUserRecord): AppUser {
  return {
    id: user.id,
    email: user.email,
    provider: normalizeProvider(user.authProvider),
    timezone: user.timezone,
    onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
    hasCompletedOnboarding: Boolean(user.onboardingCompletedAt),
  };
}

export function toOnboardingStatusResponse(
  user: OnboardingStatusRecord,
): OnboardingStatusResponse {
  return {
    hasCompletedOnboarding: Boolean(user.onboardingCompletedAt),
    onboardingCompletedAt: user.onboardingCompletedAt?.toISOString() ?? null,
  };
}

function normalizeProvider(
  provider: string,
): AppUser["provider"] {
  if (provider === "supabase" || provider === "clerk" || provider === "custom") {
    return provider;
  }

  return "custom";
}
