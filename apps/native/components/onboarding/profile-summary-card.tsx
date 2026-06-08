import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ProfileDraft, RecordRecencyBucket } from "../../lib/onboarding";
import { Pressable, Text, View } from "../ui";
import { ProfileRelationship } from "@repo/validation";

const roleLabels: Record<ProfileRelationship, string> = {
  SELF: "Myself",
  CHILD: "Child",
  PARENT: "Parent",
};

function statsLabel(profile: ProfileDraft) {
  const checkupsCount = profile.selectedCheckups.length;
  const recordsCount = profile.selectedCheckups.filter(
    (item) =>
      (item.initialRecord?.source === "exact" &&
        item.initialRecord.performedAt) ||
      (item.initialRecord?.source === "bucket" &&
        item.initialRecord.bucket !== RecordRecencyBucket.DontRemember),
  ).length;
  const checkupWord = checkupsCount === 1 ? "checkup" : "checkups";
  const recordWord = recordsCount === 1 ? "record" : "records";
  return `${checkupsCount} ${checkupWord} · ${recordsCount} ${recordWord}`;
}

export function ProfileSummaryCard({ profile }: { profile: ProfileDraft }) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-3.5 rounded-[14px] border border-text-primary/16 bg-[#F6F1E4] p-[18px]"
      onPress={() =>
        router.push(`/onboarding/profile/${profile.draftId}/review`)
      }
    >
      <View className="flex-1">
        <View className="flex-row items-baseline gap-2">
          <Text
            className="text-[16px] text-text-primary"
            style={{ fontFamily: "Geist-Medium", letterSpacing: -0.08 }}
          >
            {profile.name || profile.label}
          </Text>
          <Text
            className="text-[11px] uppercase text-[#6B7771]"
            style={{ fontFamily: "Geist-Medium", letterSpacing: 0.88 }}
          >
            {roleLabels[profile.relationship]}
          </Text>
        </View>
        <Text
          className="mt-0.5 text-[13px] text-[#6B7771]"
          style={{ fontFamily: "Geist" }}
        >
          {statsLabel(profile)}
        </Text>
      </View>
      <Feather color="#6B7771" name="chevron-right" size={16} />
    </Pressable>
  );
}
