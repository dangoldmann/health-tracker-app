import type {
  FinalizeOnboardingRequest,
  FinalizeOnboardingResponse,
} from "@repo/validation";

import { readNativeEnv } from "./env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type AppUser = {
  createdAt?: string;
  email?: string | null;
  id: string;
  supabaseAuthUserId?: string;
  updatedAt?: string;
};

export type GetMeResponse = {
  email: string | null;
  id: string;
  user: AppUser | null;
};

type ApiRequestOptions = {
  body?: unknown;
  method?: "GET" | "POST";
  token: string;
};

function buildUrl(path: string) {
  const env = readNativeEnv();
  return `${env.apiUrl}/${path.replace(/^\/+/, "")}`;
}

async function parseResponseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function apiRequest<TResponse>(
  path: string,
  { body, method = "GET", token }: ApiRequestOptions,
): Promise<TResponse> {
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      responseBody &&
      typeof responseBody === "object" &&
      "message" in responseBody
        ? String(responseBody.message)
        : "Request failed.";

    throw new ApiError(message, response.status, responseBody);
  }

  return responseBody as TResponse;
}

export function getMe(token: string) {
  return apiRequest<GetMeResponse>("/auth/me", { token });
}

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
