import { AppButton } from "../../components/app-button";
import { Card } from "../../components/card";
import { Screen } from "../../components/screen";
import { Text, View } from "../../components/ui";
import { useAuthProvider } from "../../lib/auth-provider";

export default function HomeScreen() {
  const { logout } = useAuthProvider();

  return (
    <Screen
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
              await logout();
            }}
            tone="secondary"
          />
        </View>
      </Card>
    </Screen>
  );
}
