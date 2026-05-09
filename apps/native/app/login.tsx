import { Link } from "expo-router";

import { Screen } from "../components/screen";
import { Text, View } from "../components/ui";

export default function LoginScreen() {
  return (
    <Screen>
      <View className="flex-1 justify-between">
        <View className="gap-4 pt-6">
          <Text className="font-sans text-4xl font-semibold tracking-[-1px] text-slate-900">
            Login
          </Text>
          <Text className="max-w-[320px] text-base leading-7 text-slate-500">
            This screen is ready for the upcoming authentication flow and will
            host sign-in methods next.
          </Text>
        </View>

        <View className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Text className="text-sm leading-6 text-slate-500">
            Need an account?{" "}
            <Link
              href="/register"
              style={{ color: "#3B82F6", fontWeight: "600" }}
            >
              Register
            </Link>
          </Text>
        </View>
      </View>
    </Screen>
  );
}
