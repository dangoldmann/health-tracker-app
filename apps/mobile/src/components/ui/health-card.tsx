import { View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

import { AppText } from "./app-text";

interface HealthCardProps extends ViewProps {
  eyebrow?: string;
  title: string;
}

export function HealthCard({
  children,
  className,
  eyebrow,
  title,
  ...props
}: HealthCardProps) {
  return (
    <View
      className={cn(
        "gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm",
        className,
      )}
      {...props}
    >
      <View className="gap-1">
        {eyebrow ? <AppText variant="eyebrow">{eyebrow}</AppText> : null}
        <AppText variant="sectionTitle">{title}</AppText>
      </View>
      {children}
    </View>
  );
}
