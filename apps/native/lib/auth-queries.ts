import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe } from "./api";
import { getCurrentSession, getSupabaseClient } from "./supabase";

export const sessionQueryKey = ["supabase-session"] as const;
export const meQueryKey = ["auth-me"] as const;

export function useAuthBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = getSupabaseClient().auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: sessionQueryKey });
      void queryClient.invalidateQueries({ queryKey: meQueryKey });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const sessionQuery = useQuery({
    queryKey: sessionQueryKey,
    queryFn: getCurrentSession,
  });

  const accessToken = sessionQuery.data?.access_token;

  const meQuery = useQuery({
    queryKey: meQueryKey,
    queryFn: () => getMe(accessToken ?? ""),
    enabled: Boolean(accessToken),
    retry: false,
  });

  return {
    accessToken,
    isLoading:
      sessionQuery.isLoading || (Boolean(accessToken) && meQuery.isLoading),
    me: meQuery.data,
    meError: meQuery.error,
    refetchMe: meQuery.refetch,
    session: sessionQuery.data ?? null,
    sessionError: sessionQuery.error,
  };
}
