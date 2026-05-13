import { ActivityIndicator, Text, View } from "./ui";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-[#F5F0E6] px-6">
      <ActivityIndicator />
      <Text className="text-base text-[#66736D]">{label}</Text>
    </View>
  );
}

export function DeveloperErrorScreen({ message }: { message: string }) {
  return (
    <View className="flex-1 justify-center gap-4 bg-[#F5F0E6] px-6">
      <Text className="font-serif text-4xl font-bold text-[#172421]">
        Configuration needed
      </Text>
      <Text className="leading-7 text-[#66736D]">
        The native app is missing required Expo public runtime configuration.
      </Text>
      <Text
        className="rounded-[20px] bg-[#FFFDF8] p-4 text-sm leading-6 text-[#912018]"
        selectable
      >
        {message}
      </Text>
    </View>
  );
}
