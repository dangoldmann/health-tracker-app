import { authProviderSchema, registerUserSchema } from "@repo/validation";
import { useRouter } from "expo-router";
import { ArrowRight, ShieldCheck, Smartphone } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Chip } from "@/components/ui/chip";
import { HealthCard } from "@/components/ui/health-card";
import { Screen, ScreenSection } from "@/components/ui/screen";
import { apiConfig } from "@/lib/api/config";

const sampleRegisterPayload = registerUserSchema.safeParse({
  email: "ana@example.com",
  provider: "supabase",
  timezone: apiConfig.timezone,
});

const sampleRegisterPreview = sampleRegisterPayload.success
  ? sampleRegisterPayload.data
  : sampleRegisterPayload.error.flatten();

export function AuthFoundationScreen() {
  const router = useRouter();

  return (
    <Screen
      header={
        <View className="gap-1">
          <AppText variant="eyebrow">Auth foundation</AppText>
          <AppText variant="title">
            The welcome and registration layer is ready for real providers.
          </AppText>
        </View>
      }
    >
      <View className="gap-6">
        <HealthCard
          eyebrow="Step 1"
          title="Registration contract already mirrors the backend docs"
        >
          <AppText>
            The app is wired to the shared Zod package so the auth payload can
            stay identical between mobile and NestJS.
          </AppText>
          <View className="flex-row flex-wrap gap-2">
            {authProviderSchema.options.map((provider) => (
              <Chip key={provider} active={provider === "supabase"} label={provider} />
            ))}
          </View>
          <View className="rounded-2xl bg-slate-50 p-4">
            <AppText variant="caption">Validated sample payload</AppText>
            <AppText className="mt-2 font-label text-slate-700">
              {JSON.stringify(sampleRegisterPreview, null, 2)}
            </AppText>
          </View>
        </HealthCard>

        <ScreenSection className="gap-4">
          <HealthCard eyebrow="Device context" title="Mobile-first defaults">
            <View className="flex-row gap-3">
              <ShieldCheck color="#0D9488" size={20} />
              <View className="flex-1 gap-1">
                <AppText className="font-label text-slate-800">
                  API URL
                </AppText>
                <AppText variant="body">{apiConfig.baseUrl}</AppText>
              </View>
            </View>
            <View className="flex-row gap-3">
              <Smartphone color="#3B82F6" size={20} />
              <View className="flex-1 gap-1">
                <AppText className="font-label text-slate-800">
                  Timezone
                </AppText>
                <AppText variant="body">{apiConfig.timezone}</AppText>
              </View>
            </View>
          </HealthCard>

          <AppButton
            label="Continue to onboarding blueprint"
            onPress={() => router.push("/onboarding")}
          />

          <Pressable
            className="flex-row items-center justify-center gap-2 py-2"
            onPress={() => router.push("/dashboard")}
          >
            <AppText className="font-label text-secondary">
              Preview dashboard shell
            </AppText>
            <ArrowRight color="#3B82F6" size={16} />
          </Pressable>
        </ScreenSection>
      </View>
    </Screen>
  );
}
