import { Pressable, Text } from "../ui";
import { PlusIcon } from "./icons";

export function AvailableCheckupChip({
  name,
  onAdd,
}: {
  name: string;
  onAdd: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-9 flex-row items-center gap-1.5 rounded-full border border-dashed border-text-primary/16 px-3"
      onPress={onAdd}
    >
      <PlusIcon />
      <Text
        className="text-[13.5px] text-text-primary"
        style={{ fontFamily: "Geist", letterSpacing: -0.08 }}
      >
        {name}
      </Text>
    </Pressable>
  );
}
