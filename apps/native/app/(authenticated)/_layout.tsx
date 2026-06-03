import { Redirect, Stack } from "expo-router";

import { LoadingState } from "../../components/app-state";
import { AppButton } from "../../components/app-button";
import { ErrorText } from "../../components/form-field";
import { Screen } from "../../components/screen";
import { useAuthProvider } from "../../lib/auth-provider";
import { getResumeOnboardingRoute } from "../../lib/onboarding/routes";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function AuthenticatedLayout() {
  const profiles = useOnboardingStore((state) => state.profiles);
  const { error, logout, me, status } = useAuthProvider();

  if (status === "loading") {
    return <LoadingState label="Checking your session" />;
  }

  if (status === "error") {
    return (
      <Screen title="Session check failed">
        <ErrorText>
          {error?.message ?? "Unable to verify your session."}
        </ErrorText>
        <AppButton
          label="Go to login"
          onPress={() => {
            void logout();
          }}
        />
      </Screen>
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
