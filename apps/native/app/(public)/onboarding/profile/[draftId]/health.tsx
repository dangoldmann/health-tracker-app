import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "../../../../../components/app-button";
import {
  HealthToggles,
  OnboardingStepScreen,
} from "../../../../../components/onboarding";
import { View } from "../../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileIndicator,
} from "../../../../../lib/onboarding/progress";
import { useOnboardingStore } from "../../../../../lib/onboarding/store";

export default function HealthStepScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const setProfileHealth = useOnboardingStore(
    (state) => state.setProfileHealth,
  );
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const activeProfile = profiles.find((item) => item.draftId === draftId);

  if (!activeProfile) {
    return (
      <OnboardingStepScreen title="Profile not found">
        <AppButton
          label="Restart onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </OnboardingStepScreen>
    );
  }

  function continueFlow() {
    completeProfileStep(activeProfile!.draftId, "health");
    router.push(`/onboarding/profile/${activeProfile!.draftId}/checkups`);
  }

  return (
    <OnboardingStepScreen
      footer={<AppButton label="Continue" onPress={continueFlow} />}
      kicker={getProfileIndicator(profiles, activeProfile.draftId)}
      progress={getOnboardingProgress(profiles)}
      subtitle="A quick read on your day-to-day."
      title={"A little about\nyour health."}
      titleSize={36}
    >
      <View className="mt-3">
        <HealthToggles
          onChange={(next) => setProfileHealth(activeProfile.draftId, next)}
          relationship={activeProfile.relationship}
          value={activeProfile.health}
        />
      </View>
    </OnboardingStepScreen>
  );
}
