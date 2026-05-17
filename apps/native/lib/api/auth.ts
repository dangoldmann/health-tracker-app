import type { GetMeResponse } from "@repo/validation";

import { apiRequest } from "./client";

export function getMe(token: string) {
  return apiRequest<GetMeResponse>("/auth/me", { token });
}
