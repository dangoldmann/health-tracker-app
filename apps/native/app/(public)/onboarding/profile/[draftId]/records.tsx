import { useState } from "react";
import { checkupTypeCatalog } from "@repo/validation";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "../../../../../components/app-button";
import { ErrorText } from "../../../../../components/form-field";
import {
  AddExactDateLink,
  ExactDateRow,
  OnboardingStepScreen,
  RecordSegmented,
} from "../../../../../components/onboarding";
import { Text, View } from "../../../../../components/ui";
import {
  createExactRecordDateSchema,
  formatFrequencyLabel,
  getOnboardingProgress,
  getProfileIndicator,
  recordRecencyBucketOptions,
  useOnboardingStore,
} from "../../../../../lib/onboarding";

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
    const profile = activeProfile!;
    const exactDateSchema = createExactRecordDateSchema({
      birthDate: profile.birthDate,
    });

    for (const checkup of profile.selectedCheckups) {
      const slug = checkup.checkupTypeSlug;
      const exactDate =
        checkup.initialRecord?.source === "exact"
          ? checkup.initialRecord.performedAt.trim()
          : undefined;

      if (exactDate) {
        const validation = exactDateSchema.safeParse(exactDate);
        if (!validation.success) {
          setSubmissionError(
            validation.error.issues[0]?.message ??
              "Use YYYY-MM-DD for exact dates.",
          );
          return;
        }
        setProfileRecord(profile.draftId, slug, {
          performedAt: exactDate,
          source: "exact",
        });
        continue;
      }

      if (exactDate !== undefined && exactDate === "") {
        setProfileRecord(profile.draftId, slug, undefined);
      }
    }

    completeProfileStep(profile.draftId, "records");
    router.push(`/onboarding/profile/${profile.draftId}/review`);
  }

  return (
    <OnboardingStepScreen
      footer={<AppButton label="Continue" onPress={continueFlow} />}
      kicker={getProfileIndicator(profiles, activeProfile.draftId)}
      progress={getOnboardingProgress(profiles)}
      subtitle="Roughly when was each one done? Skip any you're unsure about."
      title="Last visit?"
      titleSize={36}
    >
      <View className="mt-3 gap-[18px]">
        {activeProfile.selectedCheckups.map((checkup) => {
          const catalogItem = checkupTypeCatalog.find(
            (item) => item.slug === checkup.checkupTypeSlug,
          );
          const source = checkup.initialRecord?.source;
          const bucket =
            source === "bucket" ? checkup.initialRecord!.bucket : undefined;
          const exactDate =
            source === "exact" ? checkup.initialRecord!.performedAt : undefined;

          return (
            <View
              className="gap-2.5 border-b border-text-primary/10 pb-[18px]"
              key={checkup.checkupTypeSlug}
            >
              <View className="mb-1">
                <Text
                  className="text-[15.5px] text-text-primary"
                  style={{ fontFamily: "Geist", letterSpacing: -0.08 }}
                >
                  {catalogItem?.name ?? checkup.checkupTypeSlug}
                </Text>
                <Text
                  className="mt-0.5 text-[12.5px] text-[#6B7771]"
                  style={{ fontFamily: "Geist" }}
                >
                  {formatFrequencyLabel(checkup.frequencyDays)}
                </Text>
              </View>
              <RecordSegmented
                onSelect={(next) =>
                  setProfileRecord(
                    activeProfile.draftId,
                    checkup.checkupTypeSlug,
                    {
                      bucket: next,
                      source: "bucket",
                    },
                  )
                }
                options={recordRecencyBucketOptions}
                value={bucket}
              />
              {exactDate !== undefined ? (
                <ExactDateRow
                  exactDate={exactDate}
                  onChangeText={(value) =>
                    setProfileRecord(
                      activeProfile.draftId,
                      checkup.checkupTypeSlug,
                      {
                        performedAt: value,
                        source: "exact",
                      },
                    )
                  }
                  onClear={() =>
                    setProfileRecord(
                      activeProfile.draftId,
                      checkup.checkupTypeSlug,
                      undefined,
                    )
                  }
                />
              ) : (
                <AddExactDateLink
                  onPress={() =>
                    setProfileRecord(
                      activeProfile.draftId,
                      checkup.checkupTypeSlug,
                      {
                        performedAt: "",
                        source: "exact",
                      },
                    )
                  }
                />
              )}
            </View>
          );
        })}
      </View>
      <ErrorText>{submissionError}</ErrorText>
    </OnboardingStepScreen>
  );
}
