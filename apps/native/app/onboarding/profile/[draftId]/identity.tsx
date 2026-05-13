import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  Card,
  ChoiceCard,
  ErrorText,
  FormField,
  StepScreen,
} from "../../../../components/onboarding-ui";
import {
  parseIdentityStep,
  type IdentityStepValues,
} from "../../../../lib/onboarding/forms";
import {
  getOnboardingProgress,
  getProfileContextLabel,
} from "../../../../lib/onboarding/progress";
import { useOnboardingStore } from "../../../../lib/onboarding/store";

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
  const profile = profiles.find((item) => item.draftId === draftId);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { handleSubmit, setValue, watch } = useForm<IdentityStepValues>({
    defaultValues: {
      biologicalSex: profile?.biologicalSex ?? "OTHER",
      birthDate: profile?.birthDate ?? "",
      name: profile?.name ?? "",
    },
  });

  const values = watch();
  const contextLabel = useMemo(
    () => (profile ? getProfileContextLabel(profiles, profile.draftId) : ""),
    [profile, profiles],
  );

  if (!profile) {
    return (
      <StepScreen title="Profile not found">
        <AppButton
          label="Restart onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </StepScreen>
    );
  }

  const onSubmit = handleSubmit((formValues) => {
    setSubmissionError(null);
    const parsed = parseIdentityStep(formValues);

    if (!parsed.success) {
      setSubmissionError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    setProfileIdentity(profile.draftId, parsed.data);
    completeProfileStep(profile.draftId, "identity");
    router.push(`/onboarding/profile/${profile.draftId}/health`);
  });

  return (
    <StepScreen
      kicker={`${contextLabel} · ${profile.label}`}
      progress={getOnboardingProgress(profiles)}
      subtitle="One profile at a time keeps the recommendations specific."
      title="Who is this profile for?"
      footer={<AppButton label="Continue" onPress={onSubmit} />}
    >
      <Card>
        <FormField
          label="Name"
          onChangeText={(value) => setValue("name", value)}
          placeholder="Example: Martina"
          value={values.name}
        />
      </Card>
      <Card>
        <FormField
          label="Birth date"
          onChangeText={(value) => setValue("birthDate", value)}
          placeholder="YYYY-MM-DD"
          value={values.birthDate}
        />
      </Card>
      <Card>
        <ChoiceCard
          label="Female"
          onPress={() => setValue("biologicalSex", "FEMALE")}
          selected={values.biologicalSex === "FEMALE"}
        />
        <ChoiceCard
          label="Male"
          onPress={() => setValue("biologicalSex", "MALE")}
          selected={values.biologicalSex === "MALE"}
        />
        <ChoiceCard
          label="Other"
          onPress={() => setValue("biologicalSex", "OTHER")}
          selected={values.biologicalSex === "OTHER"}
        />
      </Card>
      <ErrorText>{submissionError}</ErrorText>
    </StepScreen>
  );
}
