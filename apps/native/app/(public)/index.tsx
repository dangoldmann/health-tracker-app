import { useRouter } from "expo-router";

import { AppButton, TextLink } from "../../components/onboarding-ui";
import { Text, View } from "../../components/ui";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background px-7 pb-11 pt-[74px]">
      <Text
        className="text-[11px] uppercase text-text-secondary"
        style={{
          fontFamily: "Geist-Medium",
          letterSpacing: 11 * 0.22,
        }}
      >
        HEALTHGUARD
      </Text>

      <View className="flex-1 justify-end pb-8">
        <Text
          className="font-serif text-[60px] text-text-primary"
          style={{
            lineHeight: 60 * 0.96,
            letterSpacing: -1.5,
          }}
        >
          {"Never miss\na "}
          <Text
            className="text-[#0A5249]"
            style={{ fontFamily: "InstrumentSerif-Italic", fontStyle: "italic" }}
          >
            checkup
          </Text>
          {"\nagain."}
        </Text>

        <Text
          className="mt-[22px] max-w-[280px] text-[15.5px] text-text-secondary"
          style={{ lineHeight: 24, fontFamily: "Geist" }}
        >
          For you, your kids, and your parents — all in one place.
        </Text>
      </View>

      <View className="gap-2.5">
        <AppButton
          label="Begin"
          onPress={() => router.push("/onboarding/tracking")}
        />
        <TextLink
          label="I already have an account"
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
}
