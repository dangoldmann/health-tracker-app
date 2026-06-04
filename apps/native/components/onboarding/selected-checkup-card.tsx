import { Pressable, Text, View } from "../ui";
import { CloseIcon } from "./icons";

const frequencyOptions = [
  { frequencyDays: 30, label: "1 month" },
  { frequencyDays: 60, label: "2 months" },
  { frequencyDays: 90, label: "3 months" },
  { frequencyDays: 120, label: "4 months" },
  { frequencyDays: 150, label: "5 months" },
  { frequencyDays: 180, label: "6 months" },
  { frequencyDays: 270, label: "9 months" },
  { frequencyDays: 365, label: "1 year" },
  { frequencyDays: 548, label: "1.5 years" },
  { frequencyDays: 730, label: "2 years" },
  { frequencyDays: 1095, label: "3 years" },
] as const;

function getFrequencyOptionIndex(frequencyDays: number) {
  const exactIndex = frequencyOptions.findIndex(
    (option) => option.frequencyDays === frequencyDays,
  );

  if (exactIndex >= 0) {
    return exactIndex;
  }

  return frequencyOptions.reduce((closestIndex, option, index) => {
    const closestDistance = Math.abs(
      frequencyOptions[closestIndex].frequencyDays - frequencyDays,
    );
    const optionDistance = Math.abs(option.frequencyDays - frequencyDays);
    return optionDistance < closestDistance ? index : closestIndex;
  }, 0);
}

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
          <CloseIcon />
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
