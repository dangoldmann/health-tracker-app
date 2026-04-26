import { useRouter } from "expo-router";
import {
  Blocks,
  HeartHandshake,
  MoveRight,
  Network,
  ShieldPlus,
} from "lucide-react-native";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { Screen, ScreenSection } from "@/components/ui/screen";

const foundationPillars = [
  {
    description:
      "Expo Router, providers, safe area, query persistence, and environment-aware API config are already wired.",
    icon: Network,
    title: "App infrastructure",
  },
  {
    description:
      "NativeWind tokens, Inter typography, health cards, buttons, progress, and status ring establish the soft medical UI language.",
    icon: HeartHandshake,
    title: "Design system base",
  },
  {
    description:
      "Shared validation, Zustand stores, and onboarding queue helpers are ready for the product flows in the docs.",
    icon: ShieldPlus,
    title: "Product scaffolding",
  },
];

export function LandingScreen() {
  const router = useRouter();

  return (
    <Screen scroll={false}>
      <View className="flex-1 justify-between gap-6 py-4">
        <View className="gap-6">
          <View className="gap-3">
            <AppText variant="eyebrow">HealthGuard mobile</AppText>
            <AppText variant="headline">
              The Expo app base is ready for onboarding, household dashboards,
              and prevention workflows.
            </AppText>
            <AppText>
              This starter is intentionally product-shaped: not feature complete,
              but already aligned with the architecture, design, and onboarding
              docs in this repo.
            </AppText>
          </View>

          <ScreenSection className="gap-4">
            {foundationPillars.map(({ description, icon: Icon, title }) => (
              <HealthCard key={title} eyebrow="Foundation" title={title}>
                <View className="flex-row gap-3">
                  <Icon color="#0D9488" size={20} />
                  <AppText className="flex-1">{description}</AppText>
                </View>
              </HealthCard>
            ))}
          </ScreenSection>
        </View>

        <View className="gap-3">
          <AppButton
            label="Open auth foundation"
            onPress={() => router.push("/auth")}
          />
          <AppButton
            label="Review onboarding structure"
            onPress={() => router.push("/onboarding")}
            variant="secondary"
          />
          <AppButton
            label="Preview design system"
            onPress={() => router.push("/design-system")}
            variant="ghost"
          />
          <View className="flex-row items-center justify-center gap-2 pt-2">
            <Blocks color="#64748B" size={16} />
            <AppText variant="body" className="text-sm text-textMuted">
              Shared schemas, mobile stores, and routing shells are in place.
            </AppText>
            <MoveRight color="#64748B" size={16} />
          </View>
        </View>
      </View>
    </Screen>
  );
}
