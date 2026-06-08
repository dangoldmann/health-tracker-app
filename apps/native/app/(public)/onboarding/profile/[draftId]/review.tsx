import { useLocalSearchParams, useRouter } from "expo-router";
import { AppButton } from "../../../../../components/app-button";
import {
  OnboardingStepScreen,
  StepReviewCard,
} from "../../../../../components/onboarding";
import { View } from "../../../../../components/ui";
import {
  getNextProfileAfter,
  getOnboardingProgress,
  getProfileIndicator,
  useOnboardingStore,
} from "../../../../../lib/onboarding";

export default function ProfileReviewScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const profile = profiles.find((item) => item.draftId === draftId);

  if (!profile) {
    return (
      <OnboardingStepScreen title="Profile not found">
        <AppButton
          label="Restart onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </OnboardingStepScreen>
    );
  }

  const activeProfile = profile;
  const nextProfile = getNextProfileAfter(profiles, activeProfile.draftId);

  function continueFlow() {
    completeProfileStep(activeProfile.draftId, "review");

    if (nextProfile) {
      router.push(`/onboarding/profile/${nextProfile.draftId}/identity`);
      return;
    }

    router.push("/onboarding/review");
  }

  return (
    <OnboardingStepScreen
      footer={
        <AppButton
          label={nextProfile ? "Continue to next profile" : "Continue"}
          onPress={continueFlow}
        />
      }
      kicker={getProfileIndicator(profiles, activeProfile.draftId)}
      progress={getOnboardingProgress(profiles)}
      subtitle="Tap any section to edit. You'll jump back to its first step."
      title="Looks right?"
      titleSize={38}
    >
      <View className="mt-3 gap-3">
        <StepReviewCard step="identity" activeProfile={activeProfile} />
        <StepReviewCard step="health" activeProfile={activeProfile} />
        <StepReviewCard step="checkups" activeProfile={activeProfile} />
        <StepReviewCard step="records" activeProfile={activeProfile} />
      </View>
    </OnboardingStepScreen>
  );
}
