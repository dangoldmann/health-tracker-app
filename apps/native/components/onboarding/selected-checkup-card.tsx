import { Pressable, Text, View } from "../ui";
import { CloseIcon } from "./icons";

function FrequencyStepper({
  onChange,
  unit,
  value,
}: {
  onChange: (next: number) => void;
  unit: string;
  value: number;
}) {
  return (
    <View className="h-8 flex-row items-stretch overflow-hidden rounded-[10px] border border-text-primary/16 bg-white">
      <Pressable
        accessibilityRole="button"
        className="w-8 items-center justify-center"
        onPress={() => onChange(Math.max(1, value - 1))}
      >
        <Text
          className="text-text-primary"
          style={{ fontSize: 16, fontFamily: "Geist-Medium" }}
        >
          −
        </Text>
      </Pressable>
      <View className="min-w-[64px] items-center justify-center border-x border-text-primary/10 px-2">
        <Text
          className="text-[13px] text-text-primary"
          style={{ fontFamily: "Geist" }}
        >
          {value} {unit}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        className="w-8 items-center justify-center"
        onPress={() => onChange(value + 1)}
      >
        <Text
          className="text-text-primary"
          style={{ fontSize: 16, fontFamily: "Geist-Medium" }}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}

export function SelectedCheckupCard({
  frequencyValue,
  name,
  onFrequencyChange,
  onRemove,
  unit,
}: {
  frequencyValue: number;
  name: string;
  onFrequencyChange: (next: number) => void;
  onRemove: () => void;
  unit: string;
}) {
  return (
    <View className="gap-3 rounded-[14px] border border-text-primary/16 bg-[#F6F1E4] p-3.5">
      <View className="flex-row items-start gap-2">
        <Text
          className="flex-1 text-[15.5px] text-text-primary"
          style={{ fontFamily: "Geist", letterSpacing: -0.08 }}
        >
          {name}
        </Text>
        <Pressable
          accessibilityRole="button"
          className="p-0.5"
          hitSlop={8}
          onPress={onRemove}
        >
          <CloseIcon />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2.5">
        <Text className="text-[12px] text-[#6B7771]">Every</Text>
        <FrequencyStepper
          onChange={onFrequencyChange}
          unit={unit}
          value={frequencyValue}
        />
      </View>
    </View>
  );
}

