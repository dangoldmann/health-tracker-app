import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "../../../../../components/app-button";
import { ErrorText, FormField } from "../../../../../components/form-field";
import {
  OnboardingStepScreen,
  SexPicker,
} from "../../../../../components/onboarding";
import { View } from "../../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileIndicator,
  identityStepSchema,
  useOnboardingStore,
} from "../../../../../lib/onboarding";
import { ProfileRelationship } from "@repo/validation";

const title: Record<ProfileRelationship, string> = {
  SELF: "Let's start\nwith you.",
  CHILD: "About\nyour child.",
  PARENT: "About\nyour parent.",
};

export default function IdentityStepScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const setProfileIdentity = useOnboardingStore(
    (state) => state.setProfileIdentity,
  );
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const activeProfile = profiles.find((item) => item.draftId === draftId);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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
    setSubmissionError(null);
    const parsed = identityStepSchema.safeParse({
      biologicalSex: activeProfile!.biologicalSex,
      birthDate: activeProfile!.birthDate,
      name: activeProfile!.name,
    });

    if (!parsed.success) {
      setSubmissionError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    completeProfileStep(activeProfile!.draftId, "identity");
    router.push(`/onboarding/profile/${activeProfile!.draftId}/health`);
  }

  return (
    <OnboardingStepScreen
      footer={<AppButton label="Continue" onPress={continueFlow} />}
      kicker={getProfileIndicator(profiles, activeProfile.draftId)}
      progress={getOnboardingProgress(profiles)}
      subtitle="Just the basics."
      title={title[activeProfile.relationship]}
      titleSize={40}
    >
      <View className="mt-3 gap-6">
        <FormField
          autoCapitalize="words"
          autoComplete="name"
          label="Full name"
          onChangeText={(value) =>
            setProfileIdentity(activeProfile.draftId, { name: value })
          }
          placeholder="John Doe"
          value={activeProfile.name ?? ""}
        />
        <FormField
          label="Birth date"
          onChangeText={(value) =>
            setProfileIdentity(activeProfile.draftId, { birthDate: value })
          }
          placeholder="YYYY-MM-DD"
          value={activeProfile.birthDate ?? ""}
        />
        <SexPicker
          onSelect={(value) =>
            setProfileIdentity(activeProfile.draftId, { biologicalSex: value })
          }
          value={activeProfile.biologicalSex}
        />
        <ErrorText>{submissionError}</ErrorText>
      </View>
    </OnboardingStepScreen>
  );
}
