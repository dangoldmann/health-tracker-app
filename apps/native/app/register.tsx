import { Link } from "expo-router";

import { Screen } from "../components/screen";
import { Text, View } from "../components/ui";

export default function RegisterScreen() {
  return (
    <Screen>
      <View className="flex-1 justify-between">
        <View className="gap-4 pt-6">
          <Text className="font-sans text-4xl font-semibold tracking-[-1px] text-slate-900">
            Register
          </Text>
          <Text className="max-w-[320px] text-base leading-7 text-slate-500">
            This screen is reserved for account creation and will connect to the
            selected auth provider in the next step.
          </Text>
        </View>

        <View className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Text className="text-sm leading-6 text-slate-500">
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#3B82F6", fontWeight: "600" }}>
              Login
            </Link>
          </Text>
        </View>
      </View>
    </Screen>
  );
}
