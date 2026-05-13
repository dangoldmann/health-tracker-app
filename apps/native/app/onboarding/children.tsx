import { useState } from "react";
import { useRouter } from "expo-router";

import {
  AppButton,
  ChoiceCard,
  StepScreen,
} from "../../components/onboarding-ui";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function ChildrenCountScreen() {
  const router = useRouter();
  const savedCount = useOnboardingStore(
    (state) => state.profileCounts.childCount,
  );
  const trackingSelection = useOnboardingStore(
    (state) => state.trackingSelection,
  );
  const setProfileCounts = useOnboardingStore(
    (state) => state.setProfileCounts,
  );
  const buildQueue = useOnboardingStore((state) => state.buildQueue);
  const [childCount, setChildCount] = useState(savedCount);

  function continueFlow() {
    setProfileCounts({ childCount });

    if (trackingSelection.parent) {
      router.push("/onboarding/parents");
      return;
    }

    buildQueue();
    const firstDraftId = trackingSelection.self ? "self-1" : "child-1";
    router.push(`/onboarding/profile/${firstDraftId}/identity`);
  }

  return (
    <StepScreen
      progress={0.12}
      subtitle="This keeps the first version focused while still covering common caregiver setups."
      title="How many children?"
    >
      <ChoiceCard
        label="1 child"
        onPress={() => setChildCount(1)}
        selected={childCount === 1}
      />
      <ChoiceCard
        label="2 children"
        onPress={() => setChildCount(2)}
        selected={childCount === 2}
      />
      <AppButton label="Continue" onPress={continueFlow} />
    </StepScreen>
  );
}
