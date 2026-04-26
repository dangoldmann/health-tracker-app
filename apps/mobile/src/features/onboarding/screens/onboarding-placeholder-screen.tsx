import { useState } from "react";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { ErrorCard } from "@/components/ui/error-card";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/providers/auth-provider";

export function OnboardingPlaceholderScreen() {
  const { appUser, completeOnboarding, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      await completeOnboarding();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save onboarding progress.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="gap-6 py-4">
        <View className="gap-3">
          <AppText variant="eyebrow">Onboarding</AppText>
          <AppText variant="headline">
            Placeholder onboarding is active for verified users.
          </AppText>
          <AppText>
            This is the current checkpoint before the full profile and queue
            flow lands.
          </AppText>
        </View>

        <HealthCard eyebrow="Account ready" title="Verified and synced">
          <View className="gap-2">
            <AppText>
              Signed in as{" "}
              <AppText className="font-label text-text">
                {appUser?.email ?? "your account"}
              </AppText>
            </AppText>
            <AppText>
              Provider:{" "}
              <AppText className="font-label text-text">
                {appUser?.provider ?? "supabase"}
              </AppText>
            </AppText>
            <AppText>
              Timezone:{" "}
              <AppText className="font-label text-text">
                {appUser?.timezone ?? "Not saved"}
              </AppText>
            </AppText>
          </View>
        </HealthCard>

        <HealthCard eyebrow="Temporary action" title="Exercise the dashboard path">
          <View className="gap-4">
            <AppText>
              Tap the button below to mark onboarding complete on the backend
              and route into the dashboard placeholder.
            </AppText>

            {error ? (
              <ErrorCard
                description={error}
                title="We couldn't save onboarding progress"
              />
            ) : null}

            <AppButton
              label="Complete onboarding"
              loading={isSubmitting}
              onPress={() => void handleComplete()}
            />
            <AppButton
              label="Sign out"
              onPress={() => void signOut()}
              variant="secondary"
            />
          </View>
        </HealthCard>
      </View>
    </Screen>
  );
}
