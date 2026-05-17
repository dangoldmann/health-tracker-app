type NativeEnv = {
  apiUrl: string;
  supabasePublishableKey: string;
  supabaseUrl: string;
};

export class NativeEnvError extends Error {
  constructor(readonly missingKeys: string[]) {
    super(`Missing native env vars: ${missingKeys.join(", ")}`);
    this.name = "NativeEnvError";
  }
}

const requiredEnv = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
  supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
};

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export function readNativeEnv(): NativeEnv {
  const missingKeys = [
    requiredEnv.apiUrl ? null : "EXPO_PUBLIC_API_URL",
    requiredEnv.supabasePublishableKey
      ? null
      : "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    requiredEnv.supabaseUrl ? null : "EXPO_PUBLIC_SUPABASE_URL",
  ].filter((key): key is string => Boolean(key));

  if (missingKeys.length > 0) {
    throw new NativeEnvError(missingKeys);
  }

  return {
    apiUrl: normalizeUrl(requiredEnv.apiUrl),
    supabasePublishableKey: requiredEnv.supabasePublishableKey,
    supabaseUrl: normalizeUrl(requiredEnv.supabaseUrl),
  };
}

export function getNativeEnvResult():
  | { env: NativeEnv; error: null }
  | { env: null; error: NativeEnvError } {
  try {
    return { env: readNativeEnv(), error: null };
  } catch (error) {
    if (error instanceof NativeEnvError) {
      return { env: null, error };
    }

    throw error;
  }
}
