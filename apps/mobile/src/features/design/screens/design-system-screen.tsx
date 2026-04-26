import { Sparkles } from "lucide-react-native";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Screen, ScreenSection } from "@/components/ui/screen";
import { StatusRing } from "@/components/ui/status-ring";

const palette = [
  { name: "Background", className: "bg-background" },
  { name: "Surface", className: "bg-surface" },
  { name: "Primary", className: "bg-primary" },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Success", className: "bg-success" },
  { name: "Alert", className: "bg-alert" },
];

export function DesignSystemScreen() {
  return (
    <Screen
      header={
        <View className="gap-1">
          <AppText variant="eyebrow">Soft medical system</AppText>
          <AppText variant="title">
            The app foundation follows the calm, card-first language from the
            docs.
          </AppText>
        </View>
      }
    >
      <View className="gap-6">
        <HealthCard eyebrow="Palette" title="60-30-10 in practice">
          <View className="flex-row flex-wrap gap-3">
            {palette.map((color) => (
              <View key={color.name} className="w-[47%] gap-2">
                <View className={`h-16 rounded-2xl border border-border ${color.className}`} />
                <AppText variant="body" className="text-sm text-slate-700">
                  {color.name}
                </AppText>
              </View>
            ))}
          </View>
        </HealthCard>

        <ScreenSection className="gap-4">
          <HealthCard eyebrow="Components" title="Core UI building blocks">
            <View className="gap-4">
              <ProgressBar label="Onboarding progress" value={68} />
              <View className="flex-row items-center justify-between">
                <StatusRing label="Ready" tone="good" />
                <StatusRing label="Soon" tone="soon" />
                <StatusRing label="Overdue" tone="overdue" />
              </View>
              <View className="gap-3">
                <AppButton label="Primary action" />
                <AppButton label="Secondary action" variant="secondary" />
                <AppButton label="Ghost action" variant="ghost" />
              </View>
            </View>
          </HealthCard>

          <HealthCard eyebrow="Interaction" title="Future-ready motion and feedback">
            <View className="flex-row gap-3">
              <Sparkles color="#0D9488" size={20} />
              <AppText>
                Buttons already trigger light haptics, and the layout is prepared
                for progressive onboarding and status-led dashboard moments.
              </AppText>
            </View>
          </HealthCard>
        </ScreenSection>
      </View>
    </Screen>
  );
}
