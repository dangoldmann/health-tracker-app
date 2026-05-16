import { useMemo, useState } from "react";
import {
  checkupTypeCatalog,
  getRecommendedCheckupsForProfile,
} from "@repo/validation";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  Card,
  ErrorText,
  FormField,
  StepScreen,
} from "../../../../../components/onboarding-ui";
import { Pressable, Text, View } from "../../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileContextLabel,
} from "../../../../../lib/onboarding/progress";
import {
  useOnboardingStore,
  type ProfileCheckupDraft,
} from "../../../../../lib/onboarding/store";

function frequencyLabel(days: number) {
  if (days === 180) {
    return "About every 6 months";
  }

  if (days === 365) {
    return "About once a year";
  }

  return `Every ${days} days`;
}

export default function CheckupsStepScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const replaceProfileCheckups = useOnboardingStore(
    (state) => state.replaceProfileCheckups,
  );
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const profile = profiles.find((item) => item.draftId === draftId);
  const initialCheckups = useMemo<ProfileCheckupDraft[]>(() => {
    if (!profile) {
      return [];
    }

    if (profile.selectedCheckups.length > 0) {
      return profile.selectedCheckups;
    }

    return getRecommendedCheckupsForProfile({
      biologicalSex: profile.biologicalSex,
      birthDate: profile.birthDate ?? "",
      healthInfo:
        profile.relationship === "SELF"
          ? { riskFactors: profile.health.self }
          : undefined,
      relationship: profile.relationship,
    }).map((checkup) => ({
      checkupTypeSlug: checkup.checkupTypeSlug,
      enabled: true,
      frequencyDays: checkup.frequencyDays,
      source: "recommended",
    }));
  }, [profile]);
  const [checkups, setCheckups] = useState(initialCheckups);
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

  const selectedSlugs = new Set(
    checkups.map((checkup) => checkup.checkupTypeSlug),
  );
  const availableCheckups = checkupTypeCatalog.filter(
    (checkupType) => !selectedSlugs.has(checkupType.slug),
  );

  function continueFlow() {
    setSubmissionError(null);

    if (checkups.length === 0) {
      setSubmissionError("Select at least one checkup.");
      return;
    }

    if (
      checkups.some(
        (checkup) =>
          !Number.isInteger(checkup.frequencyDays) ||
          checkup.frequencyDays <= 0,
      )
    ) {
      setSubmissionError("Every selected checkup needs a positive frequency.");
      return;
    }

    replaceProfileCheckups(activeProfile.draftId, checkups);
    completeProfileStep(activeProfile.draftId, "checkups");
    router.push(`/onboarding/profile/${activeProfile.draftId}/records`);
  }

  return (
    <StepScreen
      kicker={`${getProfileContextLabel(profiles, activeProfile.draftId)} · ${
        activeProfile.name || activeProfile.label
      }`}
      progress={getOnboardingProgress(profiles)}
      subtitle="These are preselected from the shared v1 recommendation rules. You can remove or adjust them."
      title="Recommended checkups"
      footer={<AppButton label="Continue" onPress={continueFlow} />}
    >
      <View className="gap-4">
        {checkups.map((checkup) => {
          const catalogItem = checkupTypeCatalog.find(
            (item) => item.slug === checkup.checkupTypeSlug,
          );

          return (
            <Card key={checkup.checkupTypeSlug}>
              <View className="gap-4">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1 gap-1">
                    <Text className="text-lg font-semibold text-[#172421]">
                      {catalogItem?.name ?? checkup.checkupTypeSlug}
                    </Text>
                    <Text className="text-sm text-[#66736D]">
                      {frequencyLabel(checkup.frequencyDays)}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      setCheckups((current) =>
                        current.filter(
                          (item) =>
                            item.checkupTypeSlug !== checkup.checkupTypeSlug,
                        ),
                      )
                    }
                  >
                    <Text className="font-semibold text-[#B42318]">Remove</Text>
                  </Pressable>
                </View>
                <FormField
                  inputMode="numeric"
                  keyboardType="number-pad"
                  label="Frequency in days"
                  onChangeText={(value) =>
                    setCheckups((current) =>
                      current.map((item) =>
                        item.checkupTypeSlug === checkup.checkupTypeSlug
                          ? {
                              ...item,
                              frequencyDays: Number.parseInt(value, 10) || 0,
                            }
                          : item,
                      ),
                    )
                  }
                  value={String(checkup.frequencyDays)}
                />
              </View>
            </Card>
          );
        })}
      </View>

      {availableCheckups.length > 0 ? (
        <Card>
          <View className="gap-3">
            <Text className="text-sm font-semibold uppercase tracking-[1.5px] text-[#6F7F78]">
              Add another
            </Text>
            {availableCheckups.map((checkupType) => (
              <Pressable
                accessibilityRole="button"
                className="rounded-[20px] border border-[#D8D2C4] bg-white px-4 py-3"
                key={checkupType.slug}
                onPress={() =>
                  setCheckups((current) => [
                    ...current,
                    {
                      checkupTypeSlug: checkupType.slug,
                      enabled: true,
                      frequencyDays: 365,
                      source: "added",
                    },
                  ])
                }
              >
                <Text className="font-semibold text-[#172421]">
                  {checkupType.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>
      ) : null}

      <ErrorText>{submissionError}</ErrorText>
    </StepScreen>
  );
}
