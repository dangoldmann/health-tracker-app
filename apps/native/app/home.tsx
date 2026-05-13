import { useRouter } from "expo-router";

import { AppButton, Card, StepScreen } from "../components/onboarding-ui";
import { Text, View } from "../components/ui";
import { getSupabaseClient } from "../lib/supabase";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <StepScreen
      subtitle="The onboarding gate is complete. Dashboard features stay out of scope for this iteration."
      title="Home"
    >
      <Card>
        <View className="gap-3">
          <Text className="text-xl font-semibold text-[#172421]">
            You are signed in.
          </Text>
          <Text className="leading-7 text-[#66736D]">
            This placeholder confirms successful authentication, onboarding
            finalization, and app gating.
          </Text>
          <AppButton
            label="Log out"
            onPress={async () => {
              await getSupabaseClient().auth.signOut({ scope: "local" });
              router.replace("/");
            }}
            tone="secondary"
          />
        </View>
      </Card>
    </StepScreen>
  );
}
