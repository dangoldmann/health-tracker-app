import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { theme } from "@/lib/constants/theme";
import { AppProviders } from "@/providers/app-providers";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontError) {
      throw fontError;
    }

    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: theme.fonts.heading,
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: "HealthGuard" }}
        />
        <Stack.Screen name="auth" options={{ title: "Welcome & Auth" }} />
        <Stack.Screen
          name="onboarding"
          options={{ title: "Dynamic Onboarding" }}
        />
        <Stack.Screen
          name="dashboard"
          options={{ title: "Household Dashboard" }}
        />
        <Stack.Screen
          name="design-system"
          options={{ title: "Design System" }}
        />
      </Stack>
    </AppProviders>
  );
}
