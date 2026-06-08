import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "../ui";
import {
  frequencyOptions,
  getFrequencyOptionIndex,
} from "../../lib/onboarding";

function FrequencyStepper({
  frequencyDays,
  onChange,
}: {
  frequencyDays: number;
  onChange: (nextFrequencyDays: number) => void;
}) {
  const optionIndex = getFrequencyOptionIndex(frequencyDays);
  const option = frequencyOptions[optionIndex];
  const canDecrease = optionIndex > 0;
  const canIncrease = optionIndex < frequencyOptions.length - 1;

  return (
    <View className="h-8 flex-row items-stretch overflow-hidden rounded-[10px] border border-text-primary/16 bg-white">
      <Pressable
        accessibilityRole="button"
        className={`w-8 items-center justify-center ${canDecrease ? "" : "opacity-35"}`}
        disabled={!canDecrease}
        onPress={() =>
          onChange(frequencyOptions[optionIndex - 1].frequencyDays)
        }
      >
        <Text
          className="text-text-primary"
          style={{ fontSize: 16, fontFamily: "Geist-Medium" }}
        >
          −
        </Text>
      </Pressable>
      <View className="min-w-[76px] items-center justify-center border-x border-text-primary/10 px-2">
        <Text
          className="text-[13px] text-text-primary"
          style={{ fontFamily: "Geist" }}
        >
          {option.label}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        className={`w-8 items-center justify-center ${canIncrease ? "" : "opacity-35"}`}
        disabled={!canIncrease}
        onPress={() =>
          onChange(frequencyOptions[optionIndex + 1].frequencyDays)
        }
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
  frequencyDays,
  name,
  onFrequencyChange,
  onRemove,
}: {
  frequencyDays: number;
  name: string;
  onFrequencyChange: (nextFrequencyDays: number) => void;
  onRemove: () => void;
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
          <Feather color="#6B7771" name="x" size={16} />
        </Pressable>
      </View>
      <View className="flex-row items-center gap-2.5">
        <Text className="text-[12px] text-[#6B7771]">Every</Text>
        <FrequencyStepper
          frequencyDays={frequencyDays}
          onChange={onFrequencyChange}
        />
      </View>
    </View>
  );
}
