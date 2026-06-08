import { MAX_CHILD_PROFILES, MAX_PARENT_PROFILES } from "@repo/validation";
import { useRouter } from "expo-router";
import { AppButton } from "../../../components/app-button";
import {
  AddProfileButton,
  OnboardingStepScreen,
  ProfileSummaryCard,
} from "../../../components/onboarding";
import { View } from "../../../components/ui";
import {
  getOnboardingProgress,
  useOnboardingStore,
} from "../../../lib/onboarding";

export default function GlobalReviewScreen() {
  const router = useRouter();
  const profiles = useOnboardingStore((state) => state.profiles);
  const addProfile = useOnboardingStore((state) => state.addProfile);
  const canAddProfile = useOnboardingStore((state) => state.canAddProfile);

  if (profiles.length === 0) {
    return (
      <OnboardingStepScreen title="No draft found">
        <AppButton
          label="Start onboarding"
          onPress={() => router.replace("/onboarding/tracking")}
        />
      </OnboardingStepScreen>
    );
  }

  const canAddChild = canAddProfile("CHILD");
  const canAddParent = canAddProfile("PARENT");

  function startNewProfile(relationship: "CHILD" | "PARENT") {
    const draftId = addProfile(relationship);
    if (draftId) {
      router.push(`/onboarding/profile/${draftId}/identity`);
    }
  }

  return (
    <OnboardingStepScreen
      footer={
        <AppButton
          label="Create my account"
          onPress={() => router.push("/onboarding/auth")}
        />
      }
      progress={getOnboardingProgress(profiles)}
      subtitle={`${profiles.length} ${
        profiles.length === 1 ? "profile" : "profiles"
      } set up. Tap any to edit, or add another.`}
      title="All set."
      titleSize={38}
    >
      <View className="mt-3 gap-2.5">
        {profiles.map((profile) => (
          <ProfileSummaryCard key={profile.draftId} profile={profile} />
        ))}
        <View className="mt-1.5 flex-row gap-2.5">
          <AddProfileButton
            disabled={!canAddChild}
            hint={
              canAddChild ? undefined : `Max ${MAX_CHILD_PROFILES} children`
            }
            label="Add another child"
            onPress={() => startNewProfile("CHILD")}
          />
          <AddProfileButton
            disabled={!canAddParent}
            hint={
              canAddParent ? undefined : `Max ${MAX_PARENT_PROFILES} parents`
            }
            label="Add another parent"
            onPress={() => startNewProfile("PARENT")}
          />
        </View>
      </View>
    </OnboardingStepScreen>
  );
}
