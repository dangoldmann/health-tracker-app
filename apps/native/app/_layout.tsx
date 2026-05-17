import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DeveloperErrorScreen } from "../components/app-state";
import { AuthProvider } from "../lib/auth";
import { getNativeEnvResult } from "../lib/env";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const AppLayout = () => {
  const envResult = getNativeEnvResult();

  if (envResult.error) {
    return <DeveloperErrorScreen message={envResult.error.message} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(authenticated)" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppLayout;
