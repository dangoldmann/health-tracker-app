import { Redirect, Stack, usePathname, useRouter } from "expo-router";

import { LoadingState } from "../../components/app-state";
import {
  AppButton,
  ErrorText,
  StepScreen,
} from "../../components/onboarding-ui";
import { useAuthProvider } from "../../lib/auth-provider";
import { getResumeOnboardingRoute } from "../../lib/onboarding/routes";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function PublicLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const isOnboardingPath = pathname.startsWith("/onboarding");
  const profiles = useOnboardingStore((state) => state.profiles);
  const { error, logout, me, status } = useAuthProvider();

  if (status === "loading" && !isOnboardingPath) {
    return <LoadingState label="Checking your session" />;
  }

  if (status === "error") {
    return (
      <StepScreen title="Session check failed">
        <ErrorText>
          {error?.message ?? "Unable to verify your session."}
        </ErrorText>
        <AppButton
          label="Go to login"
          onPress={() => {
            void logout();
            router.replace("/login");
          }}
        />
      </StepScreen>
    );
  }

  if (status === "authenticated") {
    if (me?.user) {
      return <Redirect href="/home" />;
    }

    if (!isOnboardingPath) {
      return <Redirect href={getResumeOnboardingRoute(profiles)} />;
    }
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
