import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  Card,
  StepScreen,
} from "../../../../../components/onboarding-ui";
import { Switch, Text, View } from "../../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileContextLabel,
} from "../../../../../lib/onboarding/progress";
import {
  useOnboardingStore,
  type ProfileHealthDraft,
} from "../../../../../lib/onboarding/store";

type ToggleRowProps = {
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
};

function ToggleRow({ label, onValueChange, value }: ToggleRowProps) {
  return (
    <View className="flex-row items-center justify-between gap-5 rounded-[22px] bg-white px-4 py-3">
      <Text className="flex-1 text-base font-medium text-[#172421]">
        {label}
      </Text>
      <Switch
        onValueChange={onValueChange}
        thumbColor={value ? "#FFFFFF" : "#F4F1EA"}
        trackColor={{ false: "#D8D2C4", true: "#0F766E" }}
        value={value}
      />
    </View>
  );
}

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
  const profile = profiles.find((item) => item.draftId === draftId);
  const [health, setHealth] = useState<ProfileHealthDraft | null>(
    profile?.health ?? null,
  );

  if (!profile || !health) {
    return (
      <StepScreen title="Profile not found">
        <AppButton
          label="Restart onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </StepScreen>
    );
  }

  const activeProfile = profile;
  const activeHealth = health;

  function updateHealth(nextHealth: ProfileHealthDraft) {
    setHealth(nextHealth);
  }

  function continueFlow() {
    setProfileHealth(activeProfile.draftId, activeHealth);
    completeProfileStep(activeProfile.draftId, "health");
    router.push(`/onboarding/profile/${activeProfile.draftId}/checkups`);
  }

  return (
    <StepScreen
      kicker={`${getProfileContextLabel(profiles, activeProfile.draftId)} · ${
        activeProfile.name || activeProfile.label
      }`}
      progress={getOnboardingProgress(profiles)}
      subtitle="These answers only shape the local v1 recommendations."
      title="Any health context to account for?"
      footer={<AppButton label="Continue" onPress={continueFlow} />}
    >
      <Card>
        <View className="gap-3">
          {activeProfile.relationship === "SELF" ? (
            <>
              <ToggleRow
                label="Smoker"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    self: { ...health.self, smoker: value },
                  })
                }
                value={health.self.smoker}
              />
              <ToggleRow
                label="Hypertension"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    self: { ...health.self, hasHypertension: value },
                  })
                }
                value={health.self.hasHypertension}
              />
              <ToggleRow
                label="Family history"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    self: { ...health.self, hasFamilyHistory: value },
                  })
                }
                value={health.self.hasFamilyHistory}
              />
            </>
          ) : null}

          {activeProfile.relationship === "PARENT" ? (
            <>
              <ToggleRow
                label="Diabetes"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    parent: { ...health.parent, hasDiabetes: value },
                  })
                }
                value={health.parent.hasDiabetes}
              />
              <ToggleRow
                label="Mobility issues"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    parent: { ...health.parent, hasMobilityIssues: value },
                  })
                }
                value={health.parent.hasMobilityIssues}
              />
              <ToggleRow
                label="Cognitive concerns"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    parent: { ...health.parent, hasCognitiveConcerns: value },
                  })
                }
                value={health.parent.hasCognitiveConcerns}
              />
            </>
          ) : null}

          {activeProfile.relationship === "CHILD" ? (
            <>
              <ToggleRow
                label="Allergies"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    child: { ...health.child, hasAllergies: value },
                  })
                }
                value={health.child.hasAllergies}
              />
              <ToggleRow
                label="Asthma"
                onValueChange={(value) =>
                  updateHealth({
                    ...health,
                    child: { ...health.child, hasAsthma: value },
                  })
                }
                value={health.child.hasAsthma}
              />
            </>
          ) : null}
        </View>
      </Card>
    </StepScreen>
  );
}
