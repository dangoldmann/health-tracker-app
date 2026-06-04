import { getRecommendedCheckupsForProfile } from "@repo/validation";
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
  const replaceProfileCheckups = useOnboardingStore(
    (state) => state.replaceProfileCheckups,
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
    const profile = activeProfile!;

    if (profile.selectedCheckups.length === 0) {
      const recommendedCheckups = getRecommendedCheckupsForProfile({
        biologicalSex: profile.biologicalSex,
        birthDate: profile.birthDate ?? "",
        healthInfo:
          profile.relationship === "SELF"
            ? { riskFactors: profile.health.self }
            : undefined,
        relationship: profile.relationship,
      }).map((checkup) => ({
        checkupTypeSlug: checkup.checkupTypeSlug,
        enabled: true,
        frequencyDays: checkup.frequencyDays,
        source: "recommended" as const,
      }));
      replaceProfileCheckups(profile.draftId, recommendedCheckups);
    }

    completeProfileStep(profile.draftId, "health");
    router.push(`/onboarding/profile/${profile.draftId}/checkups`);
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
