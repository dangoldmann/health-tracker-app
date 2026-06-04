import { Pressable, Text, TextInput, View } from "../ui";
import { CloseIcon } from "./icons";

export function RecordSegmented<TValue extends string>({
  onSelect,
  options,
  value,
}: {
  onSelect: (value: TValue) => void;
  options: { label: string; value: TValue }[];
  value?: TValue;
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

export function ExactDateRow({
  exactDate,
  onChangeText,
  onClear,
}: {
  exactDate: string;
  onChangeText: (next: string) => void;
  onClear: () => void;
}) {
  return (
    <View className="flex-row items-center gap-2.5 rounded-[12px] border border-text-primary/16 bg-[#F6F1E4] px-3 py-2.5">
      <Text
        className="text-[11px] uppercase text-[#6B7771]"
        style={{ fontFamily: "Geist-Medium", letterSpacing: 0.66 }}
      >
        Exact date
      </Text>
      <TextInput
        className="flex-1 text-[14px] text-text-primary"
        onChangeText={onChangeText}
        placeholder="YYYY-MM-DD"
        placeholderTextColor="rgba(15, 31, 27, 0.32)"
        style={{ fontFamily: "Geist" }}
        value={exactDate}
      />
      <Pressable
        accessibilityRole="button"
        className="p-0.5"
        hitSlop={8}
        onPress={onClear}
      >
        <CloseIcon />
      </Pressable>
    </View>
  );
}

export function AddExactDateLink({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      className="self-start py-0.5"
      hitSlop={8}
      onPress={onPress}
    >
      <Text
        className="text-[12.5px] text-[#6B7771] underline"
        style={{ fontFamily: "Geist" }}
      >
        + Add exact date
      </Text>
    </Pressable>
  );
}
