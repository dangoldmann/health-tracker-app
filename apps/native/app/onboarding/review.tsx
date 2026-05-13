import { checkupTypeCatalog } from "@repo/validation";
import { useRouter } from "expo-router";

import { AppButton, Card, StepScreen } from "../../components/onboarding-ui";
import { Pressable, Text, View } from "../../components/ui";
import { getOnboardingProgress } from "../../lib/onboarding/progress";
import { useOnboardingStore } from "../../lib/onboarding/store";

export default function GlobalReviewScreen() {
  const router = useRouter();
  const profiles = useOnboardingStore((state) => state.profiles);

  if (profiles.length === 0) {
    return (
      <StepScreen title="No draft found">
        <AppButton
          label="Start onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </StepScreen>
    );
  }

  return (
    <StepScreen
      progress={Math.max(getOnboardingProgress(profiles), 0.85)}
      subtitle="This is the full payload that will be finalized after account creation."
      title="Review all profiles"
      footer={
        <AppButton
          label="Continue to account"
          onPress={() => router.push("/onboarding/auth")}
        />
      }
    >
      <View className="gap-4">
        {profiles.map((profile) => (
          <Card key={profile.draftId}>
            <View className="gap-4">
              <View className="flex-row items-start justify-between gap-4">
                <View className="flex-1">
                  <Text className="text-xl font-semibold text-[#172421]">
                    {profile.name || profile.label}
                  </Text>
                  <Text className="text-[#66736D]">
                    {profile.relationship} · {profile.birthDate}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    router.push(
                      `/onboarding/profile/${profile.draftId}/identity`,
                    )
                  }
                >
                  <Text className="font-semibold text-[#0F766E]">Edit</Text>
                </Pressable>
              </View>
              <View className="gap-2">
                {profile.selectedCheckups.map((checkup) => {
                  const catalogItem = checkupTypeCatalog.find(
                    (item) => item.slug === checkup.checkupTypeSlug,
                  );

                  return (
                    <Text
                      className="rounded-[16px] bg-white px-4 py-3 text-sm text-[#34423D]"
                      key={checkup.checkupTypeSlug}
                    >
                      {catalogItem?.name ?? checkup.checkupTypeSlug}: every{" "}
                      {checkup.frequencyDays} days
                    </Text>
                  );
                })}
              </View>
            </View>
          </Card>
        ))}
      </View>
    </StepScreen>
  );
}
