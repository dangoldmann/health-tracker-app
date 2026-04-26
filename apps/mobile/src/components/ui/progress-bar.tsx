import { View } from "react-native";

import { AppText } from "./app-text";

interface ProgressBarProps {
  label: string;
  value: number;
}

export function ProgressBar({ label, value }: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <AppText variant="caption">{label}</AppText>
        <AppText variant="caption">{clampedValue}%</AppText>
      </View>
      <View className="h-2 overflow-hidden rounded-full bg-slate-200">
        <View
          className="h-full rounded-full bg-primary"
          style={{ width: `${clampedValue}%` }}
        />
      </View>
    </View>
  );
}
