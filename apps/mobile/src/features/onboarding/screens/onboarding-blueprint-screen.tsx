import {
  bulkUpsertUserCheckupsSchema,
  createProfileSchema,
  updateDeviceTokenSchema,
} from "@repo/validation";
import { RefreshCcw } from "lucide-react-native";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Chip } from "@/components/ui/chip";
import { HealthCard } from "@/components/ui/health-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Screen, ScreenSection } from "@/components/ui/screen";
import {
  onboardingFlowSteps,
  trackingIntentLabels,
  type TrackingIntent,
} from "@/features/onboarding/structure";
import { useOnboardingStore } from "@/stores/onboarding-store";

const sampleProfileValidation = createProfileSchema.safeParse({
  biologicalSex: "FEMALE",
  birthDate: "1990-05-15",
  insuranceProviderId: "osde-210",
  isSelf: true,
  metadata: { hypertension: true, smoker: false },
  name: "Me",
});

const sampleCheckupValidation = bulkUpsertUserCheckupsSchema.safeParse({
  checkups: [
    {
      frequencyDays: 180,
      profileId: "11111111-1111-4111-8111-111111111111",
      type: "cardiology",
    },
  ],
});

const sampleDeviceValidation = updateDeviceTokenSchema.safeParse({
  platform: "android",
  pushToken: "ExponentPushToken[demo]",
  timezone: "America/Argentina/Buenos_Aires",
});

export function OnboardingBlueprintScreen() {
  const childrenCount = useOnboardingStore((state) => state.childrenCount);
  const parentsCount = useOnboardingStore((state) => state.parentsCount);
  const queue = useOnboardingStore((state) => state.queue);
  const selectedIntents = useOnboardingStore((state) => state.selectedIntents);
  const reset = useOnboardingStore((state) => state.reset);
  const setRelativeCount = useOnboardingStore((state) => state.setRelativeCount);
  const toggleIntent = useOnboardingStore((state) => state.toggleIntent);

  const isSelected = (intent: TrackingIntent) =>
    selectedIntents.includes(intent);

  return (
    <Screen
      header={
        <View className="gap-3">
          <View className="gap-1">
            <AppText variant="eyebrow">Queue-based onboarding</AppText>
            <AppText variant="title">
              The structure already matches the branching flow from the docs.
            </AppText>
          </View>
          <ProgressBar label="Blueprint completeness" value={78} />
        </View>
      }
    >
      <View className="gap-6">
        <HealthCard eyebrow="Intent selector" title="Who are we looking after today?">
          <AppText>
            This store persists the onboarding queue locally so the user can
            recover if the app closes mid-flow.
          </AppText>
          <View className="flex-row flex-wrap gap-2">
            {(Object.keys(trackingIntentLabels) as TrackingIntent[]).map((intent) => (
              <Chip
                key={intent}
                active={isSelected(intent)}
                label={trackingIntentLabels[intent]}
                onPress={() => toggleIntent(intent)}
              />
            ))}
          </View>
        </HealthCard>

        <ScreenSection className="gap-4">
          {isSelected("children") ? (
            <HealthCard eyebrow="Branching" title="Children queue preview">
              <CounterRow
                label="Children profiles"
                onDecrease={() => setRelativeCount("children", childrenCount - 1)}
                onIncrease={() => setRelativeCount("children", childrenCount + 1)}
                value={childrenCount}
              />
            </HealthCard>
          ) : null}

          {isSelected("parents") ? (
            <HealthCard eyebrow="Branching" title="Parents / seniors queue preview">
              <CounterRow
                label="Parent profiles"
                onDecrease={() => setRelativeCount("parents", parentsCount - 1)}
                onIncrease={() => setRelativeCount("parents", parentsCount + 1)}
                value={parentsCount}
              />
            </HealthCard>
          ) : null}

          <HealthCard eyebrow="Execution order" title="Generated setup queue">
            <View className="gap-3">
              {queue.length > 0 ? (
                queue.map((item, index) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <AppText className="font-label text-slate-800">
                      {index + 1}. {item.label}
                    </AppText>
                    <AppText variant="caption">{item.kind}</AppText>
                  </View>
                ))
              ) : (
                <AppText>
                  Select at least one household segment to build the queue.
                </AppText>
              )}
            </View>
            <AppButton
              className="mt-2 self-start px-4"
              label="Reset queue"
              onPress={reset}
              variant="ghost"
            />
          </HealthCard>
        </ScreenSection>

        <HealthCard eyebrow="Flow map" title="Next feature slices already have a place">
          <View className="gap-3">
            {onboardingFlowSteps.map((step) => (
              <View
                key={step.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <AppText className="font-label text-slate-800">
                  {step.title}
                </AppText>
                <AppText>{step.description}</AppText>
              </View>
            ))}
          </View>
        </HealthCard>

        <HealthCard eyebrow="Shared validation" title="Backend contracts already connected">
          <View className="gap-3">
            <ValidationRow
              label="Profile creation schema"
              ready={sampleProfileValidation.success}
            />
            <ValidationRow
              label="Bulk user checkups schema"
              ready={sampleCheckupValidation.success}
            />
            <ValidationRow
              label="Device token schema"
              ready={sampleDeviceValidation.success}
            />
          </View>
        </HealthCard>
      </View>
    </Screen>
  );
}

interface CounterRowProps {
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  value: number;
}

function CounterRow({
  label,
  onDecrease,
  onIncrease,
  value,
}: CounterRowProps) {
  return (
    <View className="flex-row items-center justify-between">
      <AppText className="font-label text-slate-800">{label}</AppText>
      <View className="flex-row items-center gap-3">
        <AppButton
          className="min-h-10 rounded-full px-4"
          label="-"
          onPress={onDecrease}
          variant="secondary"
        />
        <AppText className="min-w-8 text-center font-label text-slate-800">
          {value}
        </AppText>
        <AppButton
          className="min-h-10 rounded-full px-4"
          label="+"
          onPress={onIncrease}
          variant="secondary"
        />
      </View>
    </View>
  );
}

function ValidationRow({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <RefreshCcw color={ready ? "#10B981" : "#F43F5E"} size={18} />
      <View className="gap-1">
        <AppText className="font-label text-slate-800">{label}</AppText>
        <AppText>{ready ? "Validated sample payload." : "Needs attention."}</AppText>
      </View>
    </View>
  );
}
