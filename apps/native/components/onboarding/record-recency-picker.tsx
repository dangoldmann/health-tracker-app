import { RecordRecencyBucket } from "../../lib/onboarding";
import { Pressable, View, Text } from "../ui";

export function RecordRecencyPicker({
  onSelect,
  options,
  value,
}: {
  onSelect: (value: RecordRecencyBucket) => void;
  options: { label: string; value: RecordRecencyBucket }[];
  value?: RecordRecencyBucket;
}) {
  return (
    <View className="flex-row gap-1.5">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            accessibilityRole="button"
            className={`h-9 flex-1 items-center justify-center rounded-[10px] border px-1.5 ${
              selected
                ? "border-text-primary bg-text-primary"
                : "border-text-primary/16 bg-transparent"
            }`}
            key={option.value}
            onPress={() => onSelect(option.value)}
          >
            <Text
              className={`text-[12px] ${
                selected ? "text-[#F6F1E2]" : "text-text-primary"
              }`}
              numberOfLines={1}
              style={{ fontFamily: "Geist-Medium", letterSpacing: -0.06 }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
