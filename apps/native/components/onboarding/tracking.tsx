import { Pressable, Text, View } from "../ui";
import { CheckIcon } from "./icons";

export function TrackingOption({
  iconLabel,
  label,
  onPress,
  selected,
  sub,
}: {
  iconLabel: string;
  label: string;
  onPress: () => void;
  selected: boolean;
  sub?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`flex-row items-center gap-4 rounded-[16px] border p-[18px] ${
        selected
          ? "border-primary bg-primary/10"
          : "border-text-primary/16 bg-[#F6F1E4]"
      }`}
      onPress={onPress}
    >
      <View className="h-11 w-11 items-center justify-center rounded-[12px] border border-text-primary/16 bg-white">
        <Text
          className="text-text-primary"
          style={{
            fontFamily: "InstrumentSerif",
            fontSize: 22,
            lineHeight: 24,
          }}
        >
          {iconLabel}
        </Text>
      </View>
      <View className="flex-1">
        <Text
          className="text-[16px] text-text-primary"
          style={{ fontFamily: "Geist-Medium", letterSpacing: -0.08 }}
        >
          {label}
        </Text>
        {sub ? (
          <Text
            className="mt-0.5 text-[13px] text-[#6B7771]"
            style={{ lineHeight: 18, fontFamily: "Geist" }}
          >
            {sub}
          </Text>
        ) : null}
      </View>
      <View
        className={`h-[22px] w-[22px] items-center justify-center rounded-[8px] border-[1.5px] ${
          selected ? "border-primary bg-primary" : "border-text-primary/16"
        }`}
      >
        {selected ? <CheckIcon /> : null}
      </View>
    </Pressable>
  );
}
