import type { ComponentProps, PropsWithChildren } from "react";

import { Screen } from "../screen";
import { Text, View } from "../ui";

function OnboardingHeader({
  profileLabel,
  progress,
}: {
  profileLabel?: string | null;
  progress?: number;
}) {
  if (progress === undefined && !profileLabel) {
    return null;
  }

  return (
    <View className="px-5 pt-3">
      {progress !== undefined ? (
        <View className="h-1 overflow-hidden rounded-full bg-text-primary/8">
          <View
            className="h-full rounded-full bg-primary"
            style={{
              width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
            }}
          />
        </View>
      ) : null}
      {profileLabel ? (
        <Text
          className="mt-2.5 text-[12px] uppercase text-[#6B7771]"
          style={{ fontFamily: "Geist-Medium", letterSpacing: 0.5 }}
        >
          {profileLabel}
        </Text>
      ) : null}
    </View>
  );
}

type OnboardingStepScreenProps = PropsWithChildren<
  Omit<ComponentProps<typeof Screen>, "header"> & {
    kicker?: string | null;
    progress?: number;
  }
>;

export function OnboardingStepScreen({
  kicker,
  progress,
  ...rest
}: OnboardingStepScreenProps) {
  return (
    <Screen
      header={<OnboardingHeader profileLabel={kicker} progress={progress} />}
      topInset={false}
      {...rest}
    />
  );
}
