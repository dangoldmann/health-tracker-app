import { useRouter } from "expo-router";

import {
  AppButton,
  Card,
  ErrorText,
  StepScreen,
} from "../../components/onboarding-ui";
import { Text, View } from "../../components/ui";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <StepScreen
      subtitle="Build a simple check-in rhythm for yourself and the family members you care for."
      title="Health tracking that starts with your real household."
    >
      <View className="gap-5 pt-4">
        <Card>
          <View className="gap-4">
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-[#6F7F78]">
              Health Guard
            </Text>
            <Text className="font-serif text-[44px] font-bold leading-[46px] tracking-[-2px] text-[#172421]">
              A calmer way to remember care.
            </Text>
            <Text className="text-base leading-7 text-[#66736D]">
              Start with a short onboarding flow. We will recommend practical
              checkups, let you adjust them, then create your account at the
              end.
            </Text>
          </View>
        </Card>

        <View className="gap-3">
          <AppButton
            label="Start onboarding"
            onPress={() => router.push("/onboarding/tracking")}
          />
          <AppButton
            label="Login"
            onPress={() => router.push("/login")}
            tone="secondary"
          />
        </View>
      </View>
    </StepScreen>
  );
}
