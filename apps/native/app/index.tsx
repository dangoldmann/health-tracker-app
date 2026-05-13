import { useEffect } from "react";
import { useRouter } from "expo-router";

import { LoadingState } from "../components/app-state";
import {
  AppButton,
  Card,
  ErrorText,
  StepScreen,
} from "../components/onboarding-ui";
import { Text, View } from "../components/ui";
import { useAuthBootstrap } from "../lib/auth-queries";
import { useOnboardingStore } from "../lib/onboarding/store";
import { getResumeOnboardingRoute } from "../lib/onboarding/routes";

export default function WelcomeScreen() {
  const router = useRouter();
  const { isLoading, me, meError, session } = useAuthBootstrap();
  const profiles = useOnboardingStore((state) => state.profiles);
  
  useEffect(() => {
    if (isLoading || !session) {
      return;
    }

    if (me?.user) {
      router.replace("/home");
      return;
    }

    if (me?.user === null) {
      router.replace(getResumeOnboardingRoute(profiles));
    }
  }, [isLoading, me?.user, profiles, router, session]);

  if (meError) {
    return (
      <StepScreen title="Session check failed">
        <ErrorText>
          {meError instanceof Error ? meError.message : "Unable to check user."}
        </ErrorText>
        <AppButton
          label="Go to login"
          onPress={() => router.replace("/login")}
        />
      </StepScreen>
    );
  }

  if (isLoading || session) {
    return <LoadingState label="Checking your session" />;
  }

  return (
    <StepScreen
      subtitle="Build a simple check-in rhythm for yourself and the family members you care for."
      title="Health tracking that starts with your real household."
    >
      <View className="gap-5 pt-4">
        <Card>
          <View className="gap-4">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-[#6F7F78]">
              Health Guard
            </Text>
            <Text className="font-serif text-[44px] font-bold leading-[46px] tracking-[-2px] text-[#172421]">
              A calmer way to remember care.
            </Text>
            <Text className="text-base leading-7 text-[#66736D]">
              Start with a short onboarding flow. We will recommend practical
              checkups, let you adjust them, then create your account at the
              end.
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <AppButton
            label="Start onboarding"
            onPress={() => router.push("/onboarding/tracking")}
          />
          <AppButton
            label="Login"
            onPress={() => router.push("/login")}
            tone="secondary"
          />
        </View>
      </View>
    </StepScreen>
  );
}
