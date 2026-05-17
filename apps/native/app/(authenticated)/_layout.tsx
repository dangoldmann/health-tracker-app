import { Redirect, Stack } from "expo-router";

import { LoadingState } from "../../components/app-state";
import {
  AppButton,
  ErrorText,
  StepScreen,
} from "../../components/onboarding-ui";
import { useAuth } from "../../lib/auth";
import { getResumeOnboardingRoute } from "../../lib/onboarding/routes";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function AuthenticatedLayout() {
  const profiles = useOnboardingStore((state) => state.profiles);
  const { error, logout, me, status } = useAuth();

  if (status === "loading") {
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
          }}
        />
      </StepScreen>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/login" />;
  }

  if (!me?.user) {
    return <Redirect href={getResumeOnboardingRoute(profiles)} />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
    </Stack>
  );
}
