import type { ProfileRelationship } from "@repo/validation";

import { SectionLabel } from "../form-field";
import { Pressable, Text, View } from "../ui";
import type { ProfileHealthDraft } from "../../lib/onboarding";

function HealthToggle({
  hint,
  label,
  onValueChange,
  value,
}: {
  hint?: string;
  label: string;
  onValueChange: (next: boolean) => void;
  value: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      className="flex-row items-center gap-4 border-t border-text-primary/10 py-3.5"
      onPress={() => onValueChange(!value)}
    >
      <View className="min-w-0 flex-1">
        <Text
          className="text-[15.5px] text-text-primary"
          style={{ fontFamily: "Geist", letterSpacing: -0.08 }}
        >
          {label}
        </Text>
        {hint ? (
          <Text className="mt-0.5 text-[12.5px] text-[#6B7771]">{hint}</Text>
        ) : null}
      </View>
      <View className="shrink-0 items-end" style={{ width: 54 }}>
        <View
          style={{
            backgroundColor: value ? "#0F6B61" : "rgba(15, 31, 27, 0.15)",
            borderRadius: 13,
            height: 26,
            justifyContent: "center",
            width: 48,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 11,
              height: 22,
              transform: [{ translateX: value ? 24 : 2 }],
              width: 22,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}

export function HealthToggles({
  onChange,
  relationship,
  value,
}: {
  onChange: (next: ProfileHealthDraft) => void;
  relationship: ProfileRelationship;
  value: ProfileHealthDraft;
}) {
  if (relationship === "SELF") {
    return (
      <>
        <HealthToggle
          label="I smoke or vape"
          onValueChange={(next) =>
            onChange({ ...value, self: { ...value.self, smoker: next } })
          }
          value={value.self.smoker}
        />
        <HealthToggle
          label="Diagnosed with hypertension"
          onValueChange={(next) =>
            onChange({
              ...value,
              self: { ...value.self, hasHypertension: next },
            })
          }
          value={value.self.hasHypertension}
        />
        <HealthToggle
          hint="Parents, siblings, or grandparents"
          label="Family history of chronic illness"
          onValueChange={(next) =>
            onChange({
              ...value,
              self: { ...value.self, hasFamilyHistory: next },
            })
          }
          value={value.self.hasFamilyHistory}
        />
        <View className="h-px bg-text-primary/10" />
      </>
    );
  }

  if (relationship === "PARENT") {
    return (
      <>
        <HealthToggle
          label="Diabetes"
          onValueChange={(next) =>
            onChange({
              ...value,
              parent: { ...value.parent, hasDiabetes: next },
            })
          }
          value={value.parent.hasDiabetes}
        />
        <HealthToggle
          label="Mobility issues"
          onValueChange={(next) =>
            onChange({
              ...value,
              parent: { ...value.parent, hasMobilityIssues: next },
            })
          }
          value={value.parent.hasMobilityIssues}
        />
        <HealthToggle
          label="Cognitive concerns"
          onValueChange={(next) =>
            onChange({
              ...value,
              parent: { ...value.parent, hasCognitiveConcerns: next },
            })
          }
          value={value.parent.hasCognitiveConcerns}
        />
        <View className="h-px bg-text-primary/10" />
      </>
    );
  }

  return (
    <>
      <View className="pb-2.5">
        <SectionLabel>Conditions</SectionLabel>
      </View>
      <HealthToggle
        label="Allergies"
        onValueChange={(next) =>
          onChange({ ...value, child: { ...value.child, hasAllergies: next } })
        }
        value={value.child.hasAllergies}
      />
      <HealthToggle
        label="Asthma"
        onValueChange={(next) =>
          onChange({ ...value, child: { ...value.child, hasAsthma: next } })
        }
        value={value.child.hasAsthma}
      />
      <View className="h-px bg-text-primary/10" />
    </>
  );
}
