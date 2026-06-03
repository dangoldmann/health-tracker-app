import { Pressable, Text, View } from "../ui";
import { BiologicalSex } from "@repo/validation";

const biologicalSexOptions: {
  label: string;
  value: BiologicalSex;
}[] = [
  { label: "Female", value: "FEMALE" },
  { label: "Male", value: "MALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

export function SexPicker({
  onSelect,
  value,
}: {
  onSelect: (value: BiologicalSex) => void;
  value?: BiologicalSex;
}) {
  return (
    <View className="gap-2">
      <Text
        className="text-[12.5px] uppercase text-[#6B7771]"
        style={{ fontFamily: "Geist-Medium", letterSpacing: 0.75 }}
      >
        Biological sex
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {biologicalSexOptions.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              accessibilityRole="button"
              className={`h-11 flex-1 items-center justify-center rounded-[12px] border ${
                selected
                  ? "border-text-primary bg-text-primary"
                  : "border-text-primary/16 bg-transparent"
              }`}
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={{ minWidth: "30%" }}
            >
              <Text
                className={`text-[14.5px] ${
                  selected ? "text-[#F6F1E2]" : "text-text-primary"
                }`}
                style={{ fontFamily: "Geist-Medium", letterSpacing: -0.08 }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
