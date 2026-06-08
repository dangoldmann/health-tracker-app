import { Feather } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "../ui";

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
        <Feather color="#6B7771" name="x" size={16} />
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
