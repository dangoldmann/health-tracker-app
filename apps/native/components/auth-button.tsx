import type { GestureResponderEvent } from "react-native";

import { Pressable, Text } from "./ui";

type AuthButtonVariant = "primary" | "secondary";

type AuthButtonProps = {
  disabled?: boolean;
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: AuthButtonVariant;
};

const variantClasses: Record<AuthButtonVariant, string> = {
  primary: "border-[#0F766E] bg-[#0F766E]",
  secondary: "border-[#CAD5F7] bg-[#FCFCFB]",
};

const textClasses: Record<AuthButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-[#13233D]",
};

export function AuthButton({
  disabled = false,
  label,
  onPress,
  variant = "primary",
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className={`rounded-[24px] border px-5 py-3.5 ${
        disabled ? "opacity-50" : ""
      } ${variantClasses[variant]}`}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        className={`text-center text-[18px] font-semibold ${textClasses[variant]}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
