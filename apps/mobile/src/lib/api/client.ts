import { apiConfig } from "./config";

type HttpMethod = "GET" | "PATCH" | "POST" | "PUT";
type AccessTokenResolver = () => Promise<string | null>;

interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  auth?: boolean;
  body?: unknown;
  method?: HttpMethod;
  path: string;
}

let accessTokenResolver: AccessTokenResolver | null = null;

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly options: {
      isNetworkError?: boolean;
      responseBody?: string;
      status?: number;
    } = {},
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export function setApiAccessTokenResolver(
  resolver: AccessTokenResolver | null,
) {
  accessTokenResolver = resolver;
}

export async function apiRequest<T>({
  auth = true,
  body,
  headers,
  method = "GET",
  path,
  ...init
}: RequestOptions): Promise<T> {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && accessTokenResolver) {
    const accessToken = await accessTokenResolver();

    if (accessToken) {
      requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  let response: Response;

  try {
    response = await fetch(buildApiUrl(path), {
      ...init,
      body: body ? JSON.stringify(body) : undefined,
      headers: requestHeaders,
      method,
    });
  } catch {
    throw new ApiClientError(
      "HealthGuard services are unavailable right now. Check your connection and confirm the API is running.",
      {
        isNetworkError: true,
      },
    );
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiClientError(
      normalizeResponseError(response.status, errorText),
      {
        responseBody: errorText,
        status: response.status,
      },
    );
  }

  return (await response.json()) as T;
}

function buildApiUrl(path: string) {
  return new URL(path, ensureTrailingSlash(apiConfig.baseUrl)).toString();
}

function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function normalizeResponseError(status: number, responseBody: string) {
  if (status >= 500) {
    return "HealthGuard services are having trouble right now. Please try again in a moment.";
  }

  if (status === 401) {
    return "Your session is no longer valid. Please sign in again.";
  }

  if (status === 403) {
    return "This action is not allowed for your account.";
  }

  if (status === 404) {
    return "The requested HealthGuard service could not be found.";
  }

  return responseBody || `Request failed with status ${status}`;
}
