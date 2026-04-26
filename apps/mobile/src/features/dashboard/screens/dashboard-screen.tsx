import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/providers/auth-provider";

export function DashboardScreen() {
  const { appUser, signOut } = useAuth();

  return (
    <Screen>
      <View className="gap-6 py-4">
        <View className="gap-3">
          <AppText variant="eyebrow">Dashboard</AppText>
          <AppText variant="headline">
            The placeholder dashboard is now behind real auth and onboarding.
          </AppText>
          <AppText>
            Future household status cards and prevention workflows will land
            here without changing the launch flow again.
          </AppText>
        </View>

        <HealthCard eyebrow="App state" title="Current account">
          <View className="gap-2">
            <AppText>
              Email:{" "}
              <AppText className="font-label text-text">
                {appUser?.email ?? "Unknown"}
              </AppText>
            </AppText>
            <AppText>
              Onboarding complete:{" "}
              <AppText className="font-label text-text">
                {appUser?.hasCompletedOnboarding ? "Yes" : "No"}
              </AppText>
            </AppText>
            <AppText>
              Completed at:{" "}
              <AppText className="font-label text-text">
                {appUser?.onboardingCompletedAt ?? "Not recorded"}
              </AppText>
            </AppText>
          </View>
        </HealthCard>

        <AppButton
          label="Sign out"
          onPress={() => void signOut()}
          variant="secondary"
        />
      </View>
    </Screen>
  );
}
