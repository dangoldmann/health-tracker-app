import { Pressable, View } from "react-native";

import { cn } from "@/lib/utils/cn";

import { AppText } from "./app-text";

interface ChipProps {
  active?: boolean;
  label: string;
  onPress?: () => void;
}

export function Chip({ active = false, label, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "rounded-full border px-4 py-2",
        active
          ? "border-primary bg-primary/10"
          : "border-slate-200 bg-surface",
      )}
      onPress={onPress}
    >
      <View>
        <AppText
          variant="body"
          className={cn(
            "text-sm",
            active ? "font-label text-primary" : "text-slate-600",
          )}
        >
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}
