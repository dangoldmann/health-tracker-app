import "../global.css";

import { Geist_400Regular, Geist_500Medium } from "@expo-google-fonts/geist";
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DeveloperErrorScreen } from "../components/app-state";
import { AuthProvider } from "../lib/auth-provider";
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
  const [fontsLoaded] = useFonts({
    Geist: Geist_400Regular,
    "Geist-Medium": Geist_500Medium,
    InstrumentSerif: InstrumentSerif_400Regular,
    "InstrumentSerif-Italic": InstrumentSerif_400Regular_Italic,
  });

  if (envResult.error) {
    return <DeveloperErrorScreen message={envResult.error.message} />;
  }

  if (!fontsLoaded) {
    return null;
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
