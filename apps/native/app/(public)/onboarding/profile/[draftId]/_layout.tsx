import { Stack, router } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { baseStackScreenOptions } from "../../../../../lib/navigation";

export default function ProfileOnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        ...baseStackScreenOptions,
      }}
    >
      <Stack.Screen
        name="identity"
        options={{
          headerLeft: () => (
            <HeaderBackButton
              onPress={() => router.back()}
              tintColor="#173331"
            />
          ),
        }}
      />
      <Stack.Screen name="health" options={{ title: "Health context" }} />
      <Stack.Screen name="checkups" options={{ title: "Checkups" }} />
      <Stack.Screen name="records" options={{ title: "Last records" }} />
      <Stack.Screen name="review" options={{ title: "Profile review" }} />
    </Stack>
  );
}
