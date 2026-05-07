import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { AuthButton } from "../components/auth-button";
import { Screen } from "../components/screen";
import { Text, View } from "../components/ui";

export default function LandingPage() {
  const router = useRouter();

  return (
    <Screen>
      <View className="flex-1 overflow-hidden">
        <View className="absolute inset-0">
          <View className="absolute -right-24 top-6 h-56 w-56 rounded-full bg-[#DDEFEA]" />
          <View className="absolute right-10 top-16 h-24 w-px bg-[#D7E7E1]" />
          <View className="absolute right-10 top-40 h-2 w-2 rounded-full bg-[#D7E7E1]" />

          <View className="absolute -left-40 bottom-16 h-72 w-72 rounded-full border border-[#DDE6F4]" />
          <View className="absolute left-8 bottom-52 h-px w-24 bg-[#DDE6F4]" />

          <View className="absolute left-10 top-24 h-14 w-14 rounded-full border border-[#E6E1D8]" />
          <View className="absolute left-20 top-36 h-px w-14 bg-[#E6E1D8]" />
        </View>

        <View className="flex-1 px-5">
          <View className="flex-1 items-center justify-center">
            <View className="items-center gap-1">
              <Text style={styles.title}>Health</Text>
              <Text style={styles.title}>Guard</Text>
            </View>
          </View>

          <View className="w-full gap-4 pb-10">
            <View className="mx-auto w-full max-w-[320px] gap-4">
              <AuthButton
                label="Login"
                onPress={() => router.push("/login")}
                variant="primary"
              />
              <AuthButton
                label="Register"
                onPress={() => router.push("/register")}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#162238",
    fontFamily: "Georgia",
    fontSize: 48,
    fontWeight: "700",
    letterSpacing: -2.4,
    lineHeight: 48,
  },
});
