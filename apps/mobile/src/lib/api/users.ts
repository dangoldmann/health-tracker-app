import {
  onboardingStatusResponseSchema,
  type OnboardingStatusResponse,
  type UpdateOnboardingStatusInput,
} from "@repo/validation";

import { apiRequest } from "./client";

export async function updateOnboardingStatus(
  input: UpdateOnboardingStatusInput,
): Promise<OnboardingStatusResponse> {
  const response = await apiRequest<unknown>({
    body: input,
    method: "PATCH",
    path: "/users/onboarding-status",
  });

  return onboardingStatusResponseSchema.parse(response);
}
