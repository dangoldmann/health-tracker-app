import { Pressable, Text, View } from "../ui";
import { PlusIcon } from "./icons";

export function AddProfileButton({
  disabled = false,
  hint,
  label,
  onPress,
}: {
  disabled?: boolean;
  hint?: string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`flex-1 items-center justify-center gap-1 rounded-[14px] border border-dashed px-3 py-3.5 ${
        disabled
          ? "border-text-primary/13 bg-text-primary/[0.035]"
          : "border-text-primary/16"
      }`}
      disabled={disabled}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-2">
        <PlusIcon color={disabled ? "rgba(15,31,27,0.28)" : "#0F6B61"} />
        <Text
          className={`text-[14px] ${
            disabled ? "text-text-primary/45" : "text-text-primary"
          }`}
          style={{ fontFamily: "Geist-Medium", letterSpacing: -0.08 }}
        >
          {label}
        </Text>
      </View>
      {hint ? (
        <Text
          className={`text-[11px] ${
            disabled ? "text-text-primary/45" : "text-[#6B7771]"
          }`}
          style={{ fontFamily: "Geist" }}
        >
          {hint}
        </Text>
      ) : null}
    </Pressable>
  );
}
