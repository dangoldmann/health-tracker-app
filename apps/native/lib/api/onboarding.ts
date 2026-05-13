import type {
  FinalizeOnboardingRequest,
  FinalizeOnboardingResponse,
} from "@repo/validation";

import { apiRequest } from "./client";

export function finalizeOnboarding(
  token: string,
  request: FinalizeOnboardingRequest,
) {
  return apiRequest<FinalizeOnboardingResponse>("/onboarding/finalize", {
    body: request,
    method: "POST",
    token,
  });
}
