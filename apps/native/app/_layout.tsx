import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DeveloperErrorScreen } from "../components/app-state";
import { getNativeEnvResult } from "../lib/env";
import { baseStackScreenOptions } from "../lib/navigation";

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
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          ...baseStackScreenOptions,
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
};

export default AppLayout;
