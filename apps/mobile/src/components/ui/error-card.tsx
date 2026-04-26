import { View } from "react-native";

import { AppButton } from "./app-button";
import { AppText } from "./app-text";
import { HealthCard } from "./health-card";

interface ErrorCardProps {
  actionLabel?: string;
  description: string;
  loading?: boolean;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  title: string;
}

export function ErrorCard({
  actionLabel,
  description,
  loading = false,
  onAction,
  onSecondaryAction,
  secondaryActionLabel,
  title,
}: ErrorCardProps) {
  return (
    <HealthCard eyebrow="Service issue" title={title}>
      <View className="gap-4">
        <AppText>{description}</AppText>
        {actionLabel && onAction ? (
          <AppButton
            label={actionLabel}
            loading={loading}
            onPress={() => onAction()}
          />
        ) : null}
        {secondaryActionLabel && onSecondaryAction ? (
          <AppButton
            label={secondaryActionLabel}
            onPress={() => onSecondaryAction()}
            variant="secondary"
          />
        ) : null}
      </View>
    </HealthCard>
  );
}
