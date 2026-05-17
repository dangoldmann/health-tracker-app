import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import type { GetMeResponse } from "@repo/validation";

import { getMe } from "./api";
import { ApiError } from "./api/client";
import { getCurrentSession, getSupabaseClient } from "./supabase";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export type AuthContextValue = {
  error: Error | null;
  logout: () => Promise<void>;
  me: GetMeResponse | null;
  notice: string | null;
  session: Session | null;
  setAuthenticatedSession: (nextSession: Session, me?: GetMeResponse) => void;
  status: AuthStatus;
};

const authMeRootQueryKey = ["auth-me"] as const;

function getAuthMeQueryKey(accessToken: string) {
  return [...authMeRootQueryKey, accessToken] as const;
}

function toError(error: unknown, fallback: string) {
  return error instanceof Error ? error : new Error(fallback);
}

function isUnauthorizedError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  const clearProfileCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: authMeRootQueryKey });
  }, [queryClient]);

  useEffect(() => {
    async function bootstrapSession() {
      setError(null);

      try {
        const restoredSession = await getCurrentSession();
        setSession(restoredSession);
      } catch (caughtError) {
        setSession(null);
        setError(toError(caughtError, "Unable to restore your session."));
      } finally {
        setIsBootstrapped(true);
      }
    }

    void bootstrapSession();

    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange((_event, nextSession) => {
      setError(null);

      if (!nextSession) {
        clearProfileCache();
        setSession(null);
        return;
      }

      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearProfileCache]);

  const accessToken = session?.access_token ?? null;
  const meQuery = useQuery({
    queryKey: accessToken
      ? getAuthMeQueryKey(accessToken)
      : ["auth-me", "none"],
    queryFn: () => getMe(accessToken ?? ""),
    enabled: Boolean(isBootstrapped && accessToken),
    retry: false,
  });

  useEffect(() => {
    if (!accessToken || !meQuery.error) {
      return;
    }

    if (isUnauthorizedError(meQuery.error)) {
      clearProfileCache();
      setError(null);
      setNotice("Your session expired. Please sign in again.");
      setSession(null);

      void getSupabaseClient()
        .auth.signOut({ scope: "local" })
        .catch(() => {
          // Keep the client signed out locally even if Supabase sign-out reports an error.
        });

      return;
    }

    setError(toError(meQuery.error, "Unable to verify your session."));
  }, [accessToken, clearProfileCache, meQuery.error]);

  const logout = useCallback(async () => {
    clearProfileCache();
    setSession(null);
    setError(null);
    setNotice(null);

    try {
      await getSupabaseClient().auth.signOut({ scope: "local" });
    } catch {
      // Keep the client signed out locally even if Supabase sign-out reports an error.
    }
  }, [clearProfileCache]);

  const setAuthenticatedSession = useCallback(
    (nextSession: Session, me?: GetMeResponse) => {
      setNotice(null);
      setError(null);
      setSession(nextSession);

      if (me !== undefined) {
        queryClient.setQueryData(
          getAuthMeQueryKey(nextSession.access_token),
          me,
        );
      }
    },
    [queryClient],
  );

  const status = useMemo<AuthStatus>(() => {
    if (!isBootstrapped) {
      return "loading";
    }

    if (session) {
      if (meQuery.isLoading || meQuery.isFetching) {
        return "loading";
      }

      if (meQuery.error) {
        return isUnauthorizedError(meQuery.error) ? "unauthenticated" : "error";
      }

      return "authenticated";
    }

    if (error) {
      return "error";
    }

    return "unauthenticated";
  }, [
    error,
    isBootstrapped,
    meQuery.error,
    meQuery.isFetching,
    meQuery.isLoading,
    session,
  ]);

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      logout,
      me: session ? (meQuery.data ?? null) : null,
      notice,
      session,
      setAuthenticatedSession,
      status,
    }),
    [
      error,
      logout,
      meQuery.data,
      notice,
      session,
      setAuthenticatedSession,
      status,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthProvider() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthProvider must be used within an AuthProvider.");
  }

  return context;
}
