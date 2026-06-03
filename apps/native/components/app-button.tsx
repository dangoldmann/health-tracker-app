import { Pressable, Text } from "./ui";

type ButtonProps = {
  disabled?: boolean;
  label: string;
  onPress?: () => void;
  tone?: "primary" | "secondary" | "ghost";
};

const buttonClasses = {
  ghost: "border-transparent bg-transparent",
  primary: "border-transparent bg-primary",
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
      } ${disabled ? "opacity-40" : ""}`}
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
