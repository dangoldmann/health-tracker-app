import { useState } from "react";
import { useRouter } from "expo-router";

import {
  AppButton,
  ChoiceCard,
  StepScreen,
} from "../../components/onboarding-ui";
import {
  useOnboardingStore,
  type TrackingSelection,
} from "../../lib/onboarding/store";

export default function TrackingScreen() {
  const router = useRouter();
  const savedSelection = useOnboardingStore((state) => state.trackingSelection);
  const setTrackingSelection = useOnboardingStore(
    (state) => state.setTrackingSelection,
  );
  const buildQueue = useOnboardingStore((state) => state.buildQueue);
  const [selection, setSelection] = useState<TrackingSelection>(savedSelection);

  const hasSelection = selection.self || selection.child || selection.parent;

  function toggle(key: keyof TrackingSelection) {
    setSelection((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function continueFlow() {
    setTrackingSelection(selection);

    if (selection.child) {
      router.push("/onboarding/children");
      return;
    }

    if (selection.parent) {
      router.push("/onboarding/parents");
      return;
    }

    buildQueue();
    router.push("/onboarding/profile/self-1/identity");
  }

  return (
    <StepScreen
      progress={0.08}
      subtitle="Choose the household members you want to configure in this onboarding run."
      title="Who are you tracking?"
    >
      <ChoiceCard
        description="Optional. Set up your own recurring checkups."
        label="Myself"
        onPress={() => toggle("self")}
        selected={selection.self}
      />
      <ChoiceCard
        description="Add one or two child profiles next."
        label="My children"
        onPress={() => toggle("child")}
        selected={selection.child}
      />
      <ChoiceCard
        description="Add one or two parent profiles next."
        label="My parents"
        onPress={() => toggle("parent")}
        selected={selection.parent}
      />
      <AppButton
        disabled={!hasSelection}
        label="Continue"
        onPress={continueFlow}
      />
    </StepScreen>
  );
}
