import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { MailCheck, ShieldCheck } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";

export function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  return (
    <Screen>
      <View className="gap-8 py-4">
        <View className="gap-3">
          <AppText variant="eyebrow">Verify your email</AppText>
          <AppText variant="headline">
            Check your inbox before onboarding starts.
          </AppText>
          <AppText>
            Supabase sent a confirmation link to{" "}
            <AppText className="font-label text-text">
              {params.email ?? "your email address"}
            </AppText>
            .
          </AppText>
        </View>

        <HealthCard eyebrow="Next step" title="Open the confirmation email">
          <View className="gap-4">
            <InfoRow
              description="Tap the confirmation link from your email app to open HealthGuard."
              icon={<MailCheck color="#0D9488" size={20} />}
              title="Use the email link"
            />
            <InfoRow
              description="The link restores your session and sends you directly into onboarding."
              icon={<ShieldCheck color="#3B82F6" size={20} />}
              title="Verification unlocks app access"
            />
          </View>
        </HealthCard>

        <View className="gap-3">
          <AppButton
            label="I already confirmed, sign in"
            onPress={() => router.replace("/sign-in" as Href)}
          />
          <AppButton
            label="Use a different email"
            onPress={() => router.replace("/sign-up" as Href)}
            variant="secondary"
          />
        </View>
      </View>
    </Screen>
  );
}

function InfoRow({
  description,
  icon,
  title,
}: {
  description: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <View className="flex-row gap-3">
      {icon}
      <View className="flex-1 gap-1">
        <AppText className="font-label text-slate-800">{title}</AppText>
        <AppText>{description}</AppText>
      </View>
    </View>
  );
}
