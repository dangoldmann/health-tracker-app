import { useState } from "react";
import { checkupTypeCatalog } from "@repo/validation";
import { useLocalSearchParams, useRouter } from "expo-router";
import { z } from "zod";

import {
  AppButton,
  Card,
  FormField,
  StepScreen,
  ErrorText,
} from "../../../../components/onboarding-ui";
import { Pressable, Text, View } from "../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileContextLabel,
} from "../../../../lib/onboarding/progress";
import { useOnboardingStore } from "../../../../lib/onboarding/store";

export default function RecordsStepScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const setProfileRecord = useOnboardingStore(
    (state) => state.setProfileRecord,
  );
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const profile = profiles.find((item) => item.draftId === draftId);
  const [records, setRecords] = useState<Record<string, string | undefined>>(
    () =>
      Object.fromEntries(
        (profile?.selectedCheckups ?? []).map((checkup) => [
          checkup.checkupTypeSlug,
          checkup.initialPerformedAt,
        ]),
      ),
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);

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

  const activeProfile = profile;

  function continueFlow() {
    setSubmissionError(null);

    for (const checkup of activeProfile.selectedCheckups) {
      const performedAt = records[checkup.checkupTypeSlug]?.trim();

      if (performedAt && !z.iso.date().safeParse(performedAt).success) {
        setSubmissionError("Use YYYY-MM-DD for last performed dates.");
        return;
      }

      setProfileRecord(
        activeProfile.draftId,
        checkup.checkupTypeSlug,
        performedAt || undefined,
      );
    }

    completeProfileStep(activeProfile.draftId, "records");
    router.push(`/onboarding/profile/${activeProfile.draftId}/review`);
  }

  return (
    <StepScreen
      kicker={`${getProfileContextLabel(profiles, activeProfile.draftId)} · ${
        activeProfile.name || activeProfile.label
      }`}
      progress={getOnboardingProgress(profiles)}
      subtitle="If you remember the last visit date, add it. Otherwise skip the item."
      title="Any last-known checkups?"
      footer={<AppButton label="Continue" onPress={continueFlow} />}
    >
      <View className="gap-4">
        {activeProfile.selectedCheckups.map((checkup) => {
          const catalogItem = checkupTypeCatalog.find(
            (item) => item.slug === checkup.checkupTypeSlug,
          );

          return (
            <Card key={checkup.checkupTypeSlug}>
              <View className="gap-3">
                <Text className="text-lg font-semibold text-[#172421]">
                  {catalogItem?.name ?? checkup.checkupTypeSlug}
                </Text>
                <FormField
                  label="Last performed date"
                  onChangeText={(value) =>
                    setRecords((current) => ({
                      ...current,
                      [checkup.checkupTypeSlug]: value,
                    }))
                  }
                  placeholder="YYYY-MM-DD"
                  value={records[checkup.checkupTypeSlug] ?? ""}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setRecords((current) => ({
                      ...current,
                      [checkup.checkupTypeSlug]: undefined,
                    }))
                  }
                >
                  <Text className="font-semibold text-[#0F766E]">
                    Skip for now
                  </Text>
                </Pressable>
              </View>
            </Card>
          );
        })}
      </View>
      <ErrorText>{submissionError}</ErrorText>
    </StepScreen>
  );
}
