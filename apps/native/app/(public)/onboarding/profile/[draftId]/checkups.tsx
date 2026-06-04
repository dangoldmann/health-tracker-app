import { checkupTypeCatalog } from "@repo/validation";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AppButton } from "../../../../../components/app-button";
import { SectionLabel } from "../../../../../components/form-field";
import {
  AvailableCheckupChip,
  OnboardingStepScreen,
  SelectedCheckupCard,
} from "../../../../../components/onboarding";
import { Text, View } from "../../../../../components/ui";
import {
  getOnboardingProgress,
  getProfileIndicator,
  useOnboardingStore,
} from "../../../../../lib/onboarding";

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
  const activeProfile = profiles.find((item) => item.draftId === draftId);

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

  const selectedSlugs = new Set(
    activeProfile.selectedCheckups.map((checkup) => checkup.checkupTypeSlug),
  );
  const availableCheckups = checkupTypeCatalog.filter(
    (checkupType) => !selectedSlugs.has(checkupType.slug),
  );

  function continueFlow() {
    completeProfileStep(activeProfile!.draftId, "checkups");
    router.push(`/onboarding/profile/${activeProfile!.draftId}/records`);
  }

  return (
    <OnboardingStepScreen
      footer={
        <AppButton
          disabled={activeProfile.selectedCheckups.length === 0}
          label="Continue"
          onPress={continueFlow}
        />
      }
      kicker={getProfileIndicator(profiles, activeProfile.draftId)}
      progress={getOnboardingProgress(profiles)}
      subtitle="We've started with what's typical for your profile. Tune as you like."
      title="Your checkups."
      titleSize={36}
    >
      <View className="mt-3 gap-2.5">
        <SectionLabel>Add more</SectionLabel>
        {availableCheckups.length === 0 ? (
          <Text
            className="text-[13px] text-text-primary/45"
            style={{ fontFamily: "Geist" }}
          >
            You&apos;ve added everything we suggest.
          </Text>
        ) : (
          <View className="flex-row flex-wrap gap-2">
            {availableCheckups.map((checkupType) => (
              <AvailableCheckupChip
                key={checkupType.slug}
                name={checkupType.name}
                onAdd={() =>
                  replaceProfileCheckups(activeProfile.draftId, [
                    ...activeProfile.selectedCheckups,
                    {
                      checkupTypeSlug: checkupType.slug,
                      frequencyDays: 365,
                      source: "added",
                    },
                  ])
                }
              />
            ))}
          </View>
        )}
      </View>

      <View className="mt-5 gap-2.5">
        <SectionLabel>{`Selected · ${activeProfile.selectedCheckups.length}`}</SectionLabel>
        <View className="gap-2.5">
          {activeProfile.selectedCheckups.map((checkup) => {
            const catalogItem = checkupTypeCatalog.find(
              (item) => item.slug === checkup.checkupTypeSlug,
            );

            return (
              <SelectedCheckupCard
                frequencyDays={checkup.frequencyDays}
                key={checkup.checkupTypeSlug}
                name={catalogItem?.name ?? checkup.checkupTypeSlug}
                onFrequencyChange={(nextFrequencyDays) =>
                  replaceProfileCheckups(
                    activeProfile.draftId,
                    activeProfile.selectedCheckups.map((item) => {
                      if (item.checkupTypeSlug !== checkup.checkupTypeSlug) {
                        return item;
                      }
                      return {
                        ...item,
                        frequencyDays: nextFrequencyDays,
                      };
                    }),
                  )
                }
                onRemove={() =>
                  replaceProfileCheckups(
                    activeProfile.draftId,
                    activeProfile.selectedCheckups.filter(
                      (item) =>
                        item.checkupTypeSlug !== checkup.checkupTypeSlug,
                    ),
                  )
                }
              />
            );
          })}
        </View>
      </View>
    </OnboardingStepScreen>
  );
}
