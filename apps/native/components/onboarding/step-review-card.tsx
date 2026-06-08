import { checkupTypeCatalog } from "@repo/validation";
import { useRouter } from "expo-router";
import { Pressable, View, Text } from "../ui";
import {
  ProfileCheckupDraft,
  recencyBucketStrings,
  ProfileDraft,
  formatFrequencyLabel,
  EditableProfileStep,
} from "../../lib/onboarding";
import { Feather } from "@expo/vector-icons";
import { SectionLabel } from "../form-field";

function recencyBucketSummary(checkup: ProfileCheckupDraft) {
  if (checkup.initialRecord?.source === "bucket") {
    return recencyBucketStrings[checkup.initialRecord.bucket];
  }

  const date =
    checkup.initialRecord?.source === "exact"
      ? checkup.initialRecord.performedAt
      : undefined;
  if (!date) return "no date";
  if (checkup.initialRecord?.source === "exact") return date;
  const year = new Date(date).getUTCFullYear();
  const now = new Date().getUTCFullYear();
  if (year === now) return "this year";
  if (year === now - 1) return "last year";
  if (year < now - 1) return "earlier";
  return date;
}

function identityLines(profile: ProfileDraft): string[] {
  const lines: string[] = [];
  if (profile.name) lines.push(profile.name);
  if (profile.birthDate) lines.push(`Born ${profile.birthDate}`);
  const label = profile.biologicalSex
    .toLocaleLowerCase()
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toLocaleUpperCase());
  lines.push(label);
  return lines;
}

function healthLines(profile: ProfileDraft): string[] {
  if (profile.relationship === "SELF") {
    const flags: string[] = [];
    if (profile.health.self.smoker) flags.push("Smoker");
    if (profile.health.self.hasHypertension) flags.push("Hypertension");
    if (profile.health.self.hasFamilyHistory) flags.push("Family history");
    return flags.length > 0 ? flags : ["No flags noted"];
  }
  if (profile.relationship === "PARENT") {
    const flags: string[] = [];
    if (profile.health.parent.hasDiabetes) flags.push("Diabetes");
    if (profile.health.parent.hasMobilityIssues) flags.push("Mobility issues");
    if (profile.health.parent.hasCognitiveConcerns)
      flags.push("Cognitive concerns");
    return flags.length > 0 ? flags : ["No flags noted"];
  }
  const flags: string[] = [];
  if (profile.health.child.hasAllergies) flags.push("Allergies");
  if (profile.health.child.hasAsthma) flags.push("Asthma");
  return flags.length > 0 ? flags : ["No flags noted"];
}

function checkupLines(profile: ProfileDraft): string[] {
  if (profile.selectedCheckups.length === 0) {
    return ["None selected"];
  }
  return profile.selectedCheckups.slice(0, 4).map((checkup) => {
    const catalogItem = checkupTypeCatalog.find(
      (item) => item.slug === checkup.checkupTypeSlug,
    );
    const name = catalogItem?.name ?? checkup.checkupTypeSlug;
    return `${name} · ${formatFrequencyLabel(checkup.frequencyDays)}`;
  });
}

function recordLines(profile: ProfileDraft): string[] {
  const lines = profile.selectedCheckups.slice(0, 3).map((checkup) => {
    const catalogItem = checkupTypeCatalog.find(
      (item) => item.slug === checkup.checkupTypeSlug,
    );
    const name = catalogItem?.name ?? checkup.checkupTypeSlug;
    return `${name} — ${recencyBucketSummary(checkup)}`;
  });
  if (profile.selectedCheckups.length > 3) {
    lines.push(`${profile.selectedCheckups.length - 3} more`);
  }
  return lines.length > 0 ? lines : ["No records yet"];
}

const stepConfig: Record<
  EditableProfileStep,
  { title: string; getLines: (profile: ProfileDraft) => string[] }
> = {
  identity: {
    title: "Identity",
    getLines: identityLines,
  },
  health: {
    title: "Health",
    getLines: healthLines,
  },
  checkups: {
    title: "Checkups",
    getLines: checkupLines,
  },
  records: {
    title: "Records",
    getLines: recordLines,
  },
};

export function StepReviewCard({
  profile,
  step,
}: {
  profile: ProfileDraft;
  step: EditableProfileStep;
}) {
  const router = useRouter();
  const { title, getLines } = stepConfig[step];
  const lines = getLines(profile);

  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-start gap-3 rounded-[14px] border border-text-primary/16 bg-[#F6F1E4] p-4"
      onPress={() =>
        router.push(`/onboarding/profile/${profile.draftId}/${step}`)
      }
    >
      <View className="flex-1">
        <SectionLabel>{title}</SectionLabel>
        <View className="mt-2 gap-1">
          {lines.map((line, index) => (
            <Text
              className="text-[14px] text-text-primary"
              key={index}
              style={{ lineHeight: 20, fontFamily: "Geist" }}
            >
              {line}
            </Text>
          ))}
        </View>
      </View>
      <View className="flex-row items-center gap-1 pt-0.5">
        <Text
          className="text-[13px] text-primary"
          style={{ fontFamily: "Geist-Medium" }}
        >
          Edit
        </Text>
        <Feather color="#0F6B61" name="chevron-right" size={16} />
      </View>
    </Pressable>
  );
}
