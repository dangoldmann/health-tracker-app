const fallbackApiUrl = "http://localhost:3001";

export const apiConfig = {
  authProvider: "supabase" as const,
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl,
  timezone:
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "America/Argentina/Buenos_Aires",
};
