import { useState } from "react";
import { useRouter } from "expo-router";

import {
  AppButton,
  ChoiceCard,
  StepScreen,
} from "../../components/onboarding-ui";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function ParentsCountScreen() {
  const router = useRouter();
  const savedCount = useOnboardingStore(
    (state) => state.profileCounts.parentCount,
  );
  const trackingSelection = useOnboardingStore(
    (state) => state.trackingSelection,
  );
  const setProfileCounts = useOnboardingStore(
    (state) => state.setProfileCounts,
  );
  const buildQueue = useOnboardingStore((state) => state.buildQueue);
  const [parentCount, setParentCount] = useState(savedCount);

  function continueFlow() {
    setProfileCounts({ parentCount });
    buildQueue();

    const firstDraftId = trackingSelection.self
      ? "self-1"
      : trackingSelection.child
        ? "child-1"
        : "parent-1";

    router.push(`/onboarding/profile/${firstDraftId}/identity`);
  }

  return (
    <StepScreen
      progress={0.15}
      subtitle="Add one or two parent profiles before we start the detailed profile steps."
      title="How many parents?"
    >
      <ChoiceCard
        label="1 parent"
        onPress={() => setParentCount(1)}
        selected={parentCount === 1}
      />
      <ChoiceCard
        label="2 parents"
        onPress={() => setParentCount(2)}
        selected={parentCount === 2}
      />
      <AppButton label="Continue" onPress={continueFlow} />
    </StepScreen>
  );
}
