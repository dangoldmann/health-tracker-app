import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "@/lib/constants/theme";
import { queryPersister } from "@/lib/query/persister";
import { queryClient } from "@/lib/query/query-client";
import { useOnboardingStore } from "@/stores/onboarding-store";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
    void useOnboardingStore.getState().hydrate();
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: queryPersister }}
    >
      <SafeAreaProvider>
        <View className="flex-1 bg-background">
          <StatusBar style="dark" />
          {children}
        </View>
      </SafeAreaProvider>
    </PersistQueryClientProvider>
  );
}
