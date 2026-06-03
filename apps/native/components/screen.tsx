import type { PropsWithChildren, ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScrollView, Text, View } from "./ui";

function SerifTitle({
  size = 38,
  subtitle,
  title,
}: {
  size?: number;
  subtitle?: string;
  title: string;
}) {
  return (
    <View className="mt-1.5">
      <Text
        className="text-text-primary"
        style={{
          fontFamily: "InstrumentSerif",
          fontSize: size,
          lineHeight: Math.round(size * 1.02),
          letterSpacing: -size * 0.02,
        }}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          className="mt-3 max-w-[320px] text-[15px] text-[#6B7771]"
          style={{ lineHeight: 22, fontFamily: "Geist" }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

export function Screen({
  children,
  footer,
  header,
  scrollable = true,
  subtitle,
  title,
  titleSize,
  topInset = true,
}: PropsWithChildren<{
  footer?: ReactNode;
  header?: ReactNode;
  scrollable?: boolean;
  subtitle?: string;
  title: string;
  titleSize?: number;
  topInset?: boolean;
}>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: topInset ? insets.top : 0 }}
    >
      {header}
      {scrollable ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-5 px-7 pt-3 pb-9"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
        >
          <SerifTitle size={titleSize} subtitle={subtitle} title={title} />
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 gap-5 px-7 pb-9 pt-3">
          <SerifTitle size={titleSize} subtitle={subtitle} title={title} />
          {children}
        </View>
      )}
      {footer ? (
        <View
          className="gap-3 px-7 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 32) }}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}
