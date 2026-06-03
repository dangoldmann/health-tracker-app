import { Stack, router } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { baseStackScreenOptions } from "../../../lib/navigation";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        ...baseStackScreenOptions,
      }}
    >
      <Stack.Screen
        name="tracking"
        options={{
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.back()}
              tintColor="#173331"
            />
          ),
        }}
      />
      <Stack.Screen name="review" options={{ title: "Review" }} />
      <Stack.Screen name="auth" options={{ title: "Create account" }} />
      <Stack.Screen name="profile/[draftId]" options={{ headerShown: false }} />
    </Stack>
  );
}
