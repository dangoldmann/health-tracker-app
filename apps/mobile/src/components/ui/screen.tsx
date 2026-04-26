import type { ReactNode } from "react";
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/utils/cn";

interface ScreenProps extends Omit<ScrollViewProps, "contentContainerStyle"> {
  contentClassName?: string;
  header?: ReactNode;
  headerClassName?: string;
  scroll?: boolean;
}

export function Screen({
  children,
  className,
  contentClassName,
  header,
  headerClassName,
  scroll = true,
  ...props
}: ScreenProps) {
  const content = (
    <View className={cn("flex-1 px-5 pb-10", contentClassName)}>{children}</View>
  );

  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)}>
      {header ? (
        <View className={cn("px-5 pb-4 pt-2", headerClassName)}>{header}</View>
      ) : null}
      {scroll ? (
        <ScrollView
          contentContainerClassName="grow"
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

export function ScreenSection({ className, ...props }: ViewProps) {
  return <View className={cn("gap-3", className)} {...props} />;
}
