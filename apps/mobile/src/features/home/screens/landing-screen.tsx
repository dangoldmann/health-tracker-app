import { useRouter, type Href } from "expo-router";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";

export function LandingScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-center gap-8 py-6">
        <View className="gap-4">
          <AppText variant="eyebrow">HealthGuard</AppText>
          <AppText variant="headline">
            Stay ahead of preventive care for yourself and the people you love.
          </AppText>
          <AppText className="max-w-[320px]">
            Sign in to keep household screenings on track, or create your
            account to start onboarding after you verify your email.
          </AppText>
        </View>

        <HealthCard
          eyebrow="Prevention first"
          title="Email verification comes before onboarding"
        >
          <AppText>
            We only unlock onboarding and the dashboard after Supabase confirms
            the email address tied to the account.
          </AppText>
        </HealthCard>

        <View className="gap-3">
          <AppButton
            label="Sign in"
            onPress={() => router.push("/sign-in" as Href)}
          />
          <AppButton
            label="Sign up"
            onPress={() => router.push("/sign-up" as Href)}
            variant="secondary"
          />
        </View>
      </View>
    </Screen>
  );
}
