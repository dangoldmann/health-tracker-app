import type { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { View } from "./ui";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView
      edges={["top", "right", "bottom", "left"]}
      style={{ flex: 1, backgroundColor: "#F6F4EE" }}
    >
      <View className="flex-1 px-5 pb-6 pt-3">{children}</View>
    </SafeAreaView>
  );
}
