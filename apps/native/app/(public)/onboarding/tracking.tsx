import { useRouter } from "expo-router";

import { AppButton } from "../../../components/app-button";
import {
  OnboardingStepScreen,
  TrackingOption,
} from "../../../components/onboarding";
import { View } from "../../../components/ui";
import { getOnboardingProgress } from "../../../lib/onboarding/progress";
import {
  useOnboardingStore,
  type TrackingSelection,
} from "../../../lib/onboarding/store";

export default function TrackingScreen() {
  const router = useRouter();
  const profiles = useOnboardingStore((state) => state.profiles);
  const selection = useOnboardingStore((state) => state.trackingSelection);
  const setTrackingSelection = useOnboardingStore(
    (state) => state.setTrackingSelection,
  );
  const buildQueue = useOnboardingStore((state) => state.buildQueue);

  const hasSelection = selection.self || selection.child || selection.parent;

  function toggle(key: keyof TrackingSelection) {
    setTrackingSelection({ ...selection, [key]: !selection[key] });
  }

  function continueFlow() {
    const firstDraftId = buildQueue();
    if (!firstDraftId) return;

    router.push(`/onboarding/profile/${firstDraftId}/identity`);
  }

  return (
    <OnboardingStepScreen
      footer={
        <AppButton
          disabled={!hasSelection}
          label="Continue"
          onPress={continueFlow}
        />
      }
      progress={getOnboardingProgress(profiles)}
      subtitle="Pick anyone you'd like to set up now. You can add more later."
      title={"Who are we\ntracking?"}
      titleSize={42}
    >
      <View className="mt-2 gap-3">
        <TrackingOption
          iconLabel="M"
          label="Myself"
          onPress={() => toggle("self")}
          selected={selection.self}
          sub="Your own checkups and records."
        />
        <TrackingOption
          iconLabel="C"
          label="My children"
          onPress={() => toggle("child")}
          selected={selection.child}
          sub="Pediatric visits, vaccinations, growth."
        />
        <TrackingOption
          iconLabel="P"
          label="My parents"
          onPress={() => toggle("parent")}
          selected={selection.parent}
          sub="Annual screenings and follow-ups."
        />
      </View>
    </OnboardingStepScreen>
  );
}
