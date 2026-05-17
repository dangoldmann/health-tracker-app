import type { PropsWithChildren, ReactNode } from "react";
import type { TextInputProps } from "react-native";

import { Pressable, ScrollView, Text, TextInput, View } from "./ui";

type ButtonProps = {
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  tone?: "primary" | "secondary" | "ghost";
};

const buttonClasses = {
  ghost: "border-transparent bg-transparent",
  primary: "border-white bg-primary",
  secondary: "border-[#D8D2C4] bg-[#FFFDF7]",
};

const buttonTextClasses = {
  ghost: "text-primary",
  primary: "text-[#F6F1E2]",
  secondary: "text-[#173331]",
};

export function AppButton({
  disabled = false,
  label,
  onPress,
  tone = "primary",
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`h-14 items-center justify-center rounded-[14px] border px-5 ${
        buttonClasses[tone]
      } ${disabled ? "opacity-50" : ""}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        className={`text-center text-[16.5px] ${buttonTextClasses[tone]}`}
        style={{ fontFamily: "Geist-Medium", letterSpacing: -0.08 }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Card({ children }: PropsWithChildren) {
  return (
    <View
      className="rounded-[30px] border border-[#E4DED0] bg-[#FFFDF8] p-5"
      style={{ boxShadow: "0 12px 30px rgba(55, 45, 28, 0.08)" }}
    >
      {children}
    </View>
  );
}

export function StepScreen({
  children,
  footer,
  kicker,
  progress,
  subtitle,
  title,
}: PropsWithChildren<{
  footer?: ReactNode;
  kicker?: string;
  progress?: number;
  subtitle?: string;
  title: string;
}>) {
  return (
    <ScrollView
      className="flex-1 bg-[#F5F0E6]"
      contentContainerClassName="min-h-full gap-6 px-5 pb-8 pt-4"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      <View className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#DCEFE7]" />
      <View className="absolute -left-24 top-52 h-72 w-72 rounded-full border border-[#E0D4BE]" />
      <View className="gap-3">
        {progress !== undefined ? (
          <View className="h-2 overflow-hidden rounded-full bg-[#E0D8C8]">
            <View
              className="h-full rounded-full bg-[#0F766E]"
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }}
            />
          </View>
        ) : null}
        {kicker ? (
          <Text className="text-xs font-semibold uppercase tracking-[2px] text-[#6F7F78]">
            {kicker}
          </Text>
        ) : null}
        <Text className="font-serif text-[38px] font-bold leading-[42px] tracking-[-1.6px] text-[#172421]">
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-base leading-7 text-[#66736D]">{subtitle}</Text>
        ) : null}
      </View>
      {children}
      {footer ? <View className="gap-3 pt-2">{footer}</View> : null}
    </ScrollView>
  );
}

export function ChoiceCard({
  description,
  label,
  onPress,
  selected,
}: {
  description?: string;
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`rounded-[26px] border p-5 ${
        selected
          ? "border-[#0F766E] bg-[#E3F4EE]"
          : "border-[#E4DED0] bg-[#FFFDF8]"
      }`}
      onPress={onPress}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold text-[#172421]">{label}</Text>
          {description ? (
            <Text className="leading-6 text-[#66736D]">{description}</Text>
          ) : null}
        </View>
        <View
          className={`h-6 w-6 rounded-full border ${
            selected ? "border-[#0F766E] bg-[#0F766E]" : "border-[#C8BEAC]"
          }`}
        />
      </View>
    </Pressable>
  );
}

export function FormField({
  error,
  label,
  ...inputProps
}: TextInputProps & { error?: string; label: string }) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-[#34423D]">{label}</Text>
      <TextInput
        className="rounded-[20px] border border-[#D8D2C4] bg-white px-4 py-4 text-base text-[#172421]"
        placeholderTextColor="#9A9181"
        {...inputProps}
      />
      {error ? (
        <Text className="text-sm leading-5 text-[#B42318]" selectable>
          {error}
        </Text>
      ) : null}
    </View>
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
      <View
        className="border-b pb-1"
        style={{ borderBottomColor: "rgba(15, 31, 27, 0.35)" }}
      >
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

export function ErrorText({ children }: PropsWithChildren) {
  if (!children) {
    return null;
  }

  return (
    <Text className="rounded-[18px] bg-[#FEE4E2] px-4 py-3 text-sm leading-5 text-[#912018]">
      {children}
    </Text>
  );
}
