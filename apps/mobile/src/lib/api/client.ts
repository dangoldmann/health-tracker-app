import { apiConfig } from "./config";

type HttpMethod = "GET" | "PATCH" | "POST" | "PUT";

interface RequestOptions extends Omit<RequestInit, "body" | "method"> {
  body?: unknown;
  method?: HttpMethod;
  path: string;
}

export async function apiRequest<T>({
  body,
  headers,
  method = "GET",
  path,
  ...init
}: RequestOptions): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    method,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function buildApiUrl(path: string) {
  return new URL(path, ensureTrailingSlash(apiConfig.baseUrl)).toString();
}

function ensureTrailingSlash(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}
