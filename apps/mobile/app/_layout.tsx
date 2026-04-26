import "../global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";

import { AppText } from "@/components/ui/app-text";
import { ErrorCard } from "@/components/ui/error-card";
import { theme } from "@/lib/constants/theme";
import { AppProviders } from "@/providers/app-providers";
import { useAuth } from "@/providers/auth-provider";

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
      <AppNavigator />
    </AppProviders>
  );
}

const publicRoutes = new Set([
  "/",
  "/auth/callback",
  "/sign-in",
  "/sign-up",
  "/verify-email",
]);

function AppNavigator() {
  const {
    appUser,
    bootstrapError,
    hasSession,
    isBootstrapping,
    retrySessionSync,
    signOut,
  } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <RouteGate
        appUser={appUser}
        hasSession={hasSession}
        isBootstrapping={isBootstrapping}
      />
      <Stack
        screenOptions={{
          animation: "slide_from_right",
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="verify-email" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="dashboard" />
      </Stack>
      {isBootstrapping && pathname !== "/auth/callback" ? <BootstrapScreen /> : null}
      {!isBootstrapping && hasSession && !appUser && bootstrapError ? (
        <RecoveryScreen
          error={bootstrapError}
          onRetry={() => void retrySessionSync()}
          onSignOut={() => void signOut()}
        />
      ) : null}
    </>
  );
}

function RouteGate({
  appUser,
  hasSession,
  isBootstrapping,
}: {
  appUser: ReturnType<typeof useAuth>["appUser"];
  hasSession: boolean;
  isBootstrapping: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    const isPublicRoute = publicRoutes.has(pathname);

    if (!hasSession) {
      if (!isPublicRoute) {
        router.replace("/");
      }

      return;
    }

    if (!appUser) {
      return;
    }

    const targetRoute = appUser.hasCompletedOnboarding
      ? "/dashboard"
      : "/onboarding";

    if (pathname !== targetRoute) {
      router.replace(targetRoute);
    }
  }, [appUser, hasSession, isBootstrapping, pathname, router]);

  return null;
}

function BootstrapScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
      <ActivityIndicator color={theme.colors.primary} size="large" />
      <View className="items-center gap-2">
        <AppText variant="title" className="text-center">
          Loading your HealthGuard account
        </AppText>
        <AppText className="max-w-[280px] text-center text-textMuted">
          Checking your session and routing you to the right place.
        </AppText>
      </View>
    </View>
  );
}

function RecoveryScreen({
  error,
  onRetry,
  onSignOut,
}: {
  error: string;
  onRetry: () => void;
  onSignOut: () => void;
}) {
  return (
    <View className="absolute inset-0 z-10 items-center justify-center bg-background px-6">
      <ErrorCard
        actionLabel="Retry sync"
        description={error}
        onAction={onRetry}
        onSecondaryAction={onSignOut}
        secondaryActionLabel="Sign out"
        title="We couldn't finish signing you into HealthGuard"
      />
    </View>
  );
}
