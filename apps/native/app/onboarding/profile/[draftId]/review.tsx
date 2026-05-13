import { checkupTypeCatalog } from "@repo/validation";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  AppButton,
  Card,
  StepScreen,
} from "../../../../components/onboarding-ui";
import { Text, View } from "../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileContextLabel,
} from "../../../../lib/onboarding/progress";
import {
  getNextProfileAfter,
  useOnboardingStore,
} from "../../../../lib/onboarding/store";

export default function ProfileReviewScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams<{ draftId: string }>();
  const profiles = useOnboardingStore((state) => state.profiles);
  const completeProfileStep = useOnboardingStore(
    (state) => state.completeProfileStep,
  );
  const profile = profiles.find((item) => item.draftId === draftId);

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
    completeProfileStep(activeProfile.draftId, "review");
    const nextProfile = getNextProfileAfter(profiles, activeProfile.draftId);

    if (nextProfile) {
      router.push(`/onboarding/profile/${nextProfile.draftId}/identity`);
      return;
    }

    router.push("/onboarding/review");
  }

  return (
    <StepScreen
      kicker={`${getProfileContextLabel(profiles, activeProfile.draftId)} · ${
        activeProfile.name || activeProfile.label
      }`}
      progress={getOnboardingProgress(profiles)}
      subtitle="Confirm this profile before moving to the next queued person."
      title="Profile review"
      footer={
        <AppButton
          label={
            getNextProfileAfter(profiles, activeProfile.draftId)
              ? "Continue to next profile"
              : "Continue to global review"
          }
          onPress={continueFlow}
        />
      }
    >
      <Card>
        <View className="gap-3">
          <Text className="text-2xl font-semibold text-[#172421]">
            {activeProfile.name}
          </Text>
          <Text className="text-[#66736D]">
            {activeProfile.relationship} · {activeProfile.birthDate} ·{" "}
            {activeProfile.biologicalSex}
          </Text>
        </View>
      </Card>
      <Card>
        <View className="gap-3">
          <Text className="text-sm font-semibold uppercase tracking-[1.5px] text-[#6F7F78]">
            Checkups
          </Text>
          {activeProfile.selectedCheckups.map((checkup) => {
            const catalogItem = checkupTypeCatalog.find(
              (item) => item.slug === checkup.checkupTypeSlug,
            );

            return (
              <View
                className="rounded-[20px] bg-white px-4 py-3"
                key={checkup.checkupTypeSlug}
              >
                <Text className="font-semibold text-[#172421]">
                  {catalogItem?.name ?? checkup.checkupTypeSlug}
                </Text>
                <Text className="text-sm text-[#66736D]">
                  Every {checkup.frequencyDays} days
                  {checkup.initialPerformedAt
                    ? ` · last done ${checkup.initialPerformedAt}`
                    : " · no last date"}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>
    </StepScreen>
  );
}
