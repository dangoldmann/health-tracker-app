import {
  appUserSchema,
  type AppUser,
  type RegisterUserInput,
} from "@repo/validation";

import { apiRequest } from "./client";

export async function registerCurrentUser(input: RegisterUserInput) {
  const response = await apiRequest<unknown>({
    body: input,
    method: "POST",
    path: "/auth/register",
  });

  return appUserSchema.parse(response);
}

export async function fetchCurrentUser(): Promise<AppUser> {
  const response = await apiRequest<unknown>({
    method: "GET",
    path: "/auth/me",
  });

  return appUserSchema.parse(response);
}
