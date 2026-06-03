import type { PropsWithChildren } from "react";
import type { TextInputProps } from "react-native";

import { Pressable, Text, TextInput, View } from "./ui";

export function FormField({
  error,
  label,
  ...inputProps
}: TextInputProps & { error?: string; label: string }) {
  return (
    <View className="gap-2">
      <Text
        className="text-[12.5px] uppercase text-[#6B7771]"
        style={{ fontFamily: "Geist-Medium", letterSpacing: 0.75 }}
      >
        {label}
      </Text>
      <View className="h-[38px] justify-center border-b border-text-primary/16">
        <TextInput
          className="text-[17px] text-text-primary"
          placeholderTextColor="rgba(15, 31, 27, 0.32)"
          style={{ fontFamily: "Geist" }}
          {...inputProps}
        />
      </View>
      {error ? (
        <Text className="text-[13px] leading-5 text-[#B42318]" selectable>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  return (
    <Text
      className="text-[12px] uppercase text-[#6B7771]"
      style={{ fontFamily: "Geist-Medium", letterSpacing: 1 }}
    >
      {children}
    </Text>
  );
}

export function ErrorText({ children }: PropsWithChildren) {
  if (!children) {
    return null;
  }

  return (
    <Text className="rounded-[12px] bg-[#FEE4E2] px-4 py-3 text-[13px] leading-5 text-[#912018]">
      {children}
    </Text>
  );
}

export function TextLink({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      className="items-center justify-center self-center px-4 py-2 pt-1"
      hitSlop={12}
      onPress={onPress}
    >
      <View className="border-b border-text-primary/35 pb-1">
        <Text
          className="text-[15px] text-text-primary"
          style={{ fontFamily: "Geist-Medium", letterSpacing: -0.075 }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
