const fallbackApiUrl = "http://localhost:4000/api";
const fallbackRedirectUrl = "healthguard://auth/callback";

export const apiConfig = {
  authProvider: "supabase" as const,
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? fallbackApiUrl,
  supabaseRedirectUrl:
    process.env.EXPO_PUBLIC_SUPABASE_REDIRECT_URL ?? fallbackRedirectUrl,
  timezone:
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "America/Argentina/Buenos_Aires",
};
