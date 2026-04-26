import type { AppUser } from "@repo/validation";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { fetchCurrentUser, registerCurrentUser } from "@/lib/api/auth";
import { ApiClientError, setApiAccessTokenResolver } from "@/lib/api/client";
import { apiConfig } from "@/lib/api/config";
import { updateOnboardingStatus } from "@/lib/api/users";
import { supabase } from "@/lib/supabase/client";

interface AuthContextValue {
  appUser: AppUser | null;
  bootstrapError: string | null;
  clearBootstrapError: () => void;
  completeOnboarding: () => Promise<void>;
  handleAuthCallback: (url: string) => Promise<void>;
  hasSession: boolean;
  isBootstrapping: boolean;
  retrySessionSync: () => Promise<void>;
  session: Session | null;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (input: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setApiAccessTokenResolver(async () => {
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    });

    return () => {
      setApiAccessTokenResolver(null);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (!initialSession) {
        clearAuthState();
        setIsBootstrapping(false);
        return;
      }

      try {
        await syncSession(initialSession);
      } catch (error) {
        if (isMounted) {
          setBootstrapError(normalizeAuthError(error));
          setIsBootstrapping(false);
        }
      }
    };

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_OUT" || !nextSession) {
        clearAuthState();
        setIsBootstrapping(false);
        return;
      }

      setSession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    appUser,
    bootstrapError,
    clearBootstrapError: () => setBootstrapError(null),
    completeOnboarding: async () => {
      const response = await updateOnboardingStatus({ completed: true });

      setAppUser((currentUser) =>
        currentUser
          ? {
              ...currentUser,
              hasCompletedOnboarding: response.hasCompletedOnboarding,
              onboardingCompletedAt: response.onboardingCompletedAt,
            }
          : currentUser,
      );
    },
    handleAuthCallback: async (url: string) => {
      setBootstrapError(null);
      setIsBootstrapping(true);

      const params = extractAuthParams(url);
      const errorCode = params.get("error_code");
      const errorDescription = params.get("error_description");

      if (errorCode) {
        throw new Error(errorDescription ?? "Unable to verify your email.");
      }

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const authCode = params.get("code");
      const otpType = params.get("type");
      const tokenHash = params.get("token_hash");

      let nextSession: Session | null = null;

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        nextSession = data.session;
      } else if (authCode) {
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(authCode);

        if (error) {
          throw error;
        }

        nextSession = data.session;
      } else if (tokenHash && isSupportedEmailOtpType(otpType)) {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });

        if (error) {
          throw error;
        }

        nextSession =
          data.session ?? (await supabase.auth.getSession()).data.session;
      }

      if (!nextSession) {
        throw new Error("No confirmed session was returned from Supabase.");
      }

      await syncSession(nextSession);
    },
    hasSession: Boolean(session),
    isBootstrapping,
    retrySessionSync: async () => {
      const activeSession = session ?? (await supabase.auth.getSession()).data.session;

      if (!activeSession) {
        throw new Error("There is no active session to sync.");
      }

      await syncSession(activeSession);
    },
    session,
    signIn: async ({ email, password }) => {
      setBootstrapError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(normalizeAuthError(error));
      }

      if (!data.session) {
        throw new Error("Sign-in succeeded but no session was returned.");
      }

      await syncSession(data.session);
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      clearAuthState();
    },
    signUp: async ({ email, password }) => {
      setBootstrapError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: apiConfig.supabaseRedirectUrl,
        },
      });

      if (error) {
        throw new Error(normalizeAuthError(error));
      }

      if (data.session) {
        await supabase.auth.signOut();
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  async function syncSession(nextSession: Session) {
    setSession(nextSession);
    setIsBootstrapping(true);
    setBootstrapError(null);

    try {
      const email = nextSession.user.email;

      if (!email) {
        throw new Error("Your account is missing an email address.");
      }

      await registerCurrentUser({
        email,
        provider: apiConfig.authProvider,
        timezone: apiConfig.timezone,
      });

      const nextUser = await fetchCurrentUser();
      setAppUser(nextUser);
    } catch (error) {
      setAppUser(null);
      setBootstrapError(normalizeAuthError(error));
      throw error;
    } finally {
      setIsBootstrapping(false);
    }
  }

  function clearAuthState() {
    setAppUser(null);
    setBootstrapError(null);
    setSession(null);
  }
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

function extractAuthParams(url: string) {
  const [baseUrl = "", hashFragment = ""] = url.split("#");
  const queryString = baseUrl.includes("?") ? baseUrl.split("?")[1] : "";
  const params = new URLSearchParams(queryString);
  const hashParams = new URLSearchParams(hashFragment);

  hashParams.forEach((value, key) => {
    params.set(key, value);
  });

  return params;
}

function normalizeAuthError(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  const message = error instanceof Error
    ? error.message
    : "Something went wrong while preparing your session.";
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("confirm your email") ||
    normalizedMessage.includes("email_not_confirmed")
  ) {
    return "Please confirm your email before signing in.";
  }

  if (
    normalizedMessage.includes("email rate limit exceeded") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("over_email_send_rate_limit")
  ) {
    return "Too many confirmation emails were requested. Please wait a bit before trying again.";
  }

  if (
    normalizedMessage.includes("user already registered") ||
    normalizedMessage.includes("already been registered")
  ) {
    return "This email is already registered. Try signing in instead.";
  }

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("invalid_credentials")
  ) {
    return "That email or password is incorrect.";
  }

  if (
    normalizedMessage.includes("password should be at least") ||
    normalizedMessage.includes("weak password")
  ) {
    return "Choose a stronger password that meets Supabase's requirements.";
  }

  return message;
}

function isSupportedEmailOtpType(
  value: string | null,
): value is "email" | "signup" | "magiclink" | "recovery" | "invite" | "email_change" {
  return (
    value === "email" ||
    value === "signup" ||
    value === "magiclink" ||
    value === "recovery" ||
    value === "invite" ||
    value === "email_change"
  );
}
