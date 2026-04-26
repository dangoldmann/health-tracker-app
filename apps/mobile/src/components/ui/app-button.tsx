import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/utils/cn";

import { AppText } from "./app-text";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface AppButtonProps extends PressableProps {
  label: string;
  loading?: boolean;
  variant?: ButtonVariant;
}

const variantClassName: Record<ButtonVariant, string> = {
  ghost: "bg-transparent",
  primary: "bg-primary",
  secondary: "border border-secondary/20 bg-surface",
};

const textVariantClassName: Record<ButtonVariant, string> = {
  ghost: "text-secondary",
  primary: "text-white",
  secondary: "text-secondary",
};

export function AppButton({
  className,
  disabled,
  label,
  loading = false,
  onPress,
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "min-h-14 items-center justify-center rounded-2xl px-5",
        variantClassName[variant],
        disabled || loading ? "opacity-60" : "opacity-100",
        className,
      )}
      disabled={disabled || loading}
      onPress={async (event) => {
        await Haptics.selectionAsync();
        onPress?.(event);
      }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#3B82F6"} />
      ) : (
        <AppText variant="button" className={textVariantClassName[variant]}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
