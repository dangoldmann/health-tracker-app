import { useRouter } from "expo-router";
import { Bell, CalendarClock, HeartPulse } from "lucide-react-native";
import { View } from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { Chip } from "@/components/ui/chip";
import { HealthCard } from "@/components/ui/health-card";
import { Screen, ScreenSection } from "@/components/ui/screen";
import { StatusRing } from "@/components/ui/status-ring";
import { useActiveProfileStore } from "@/stores/active-profile-store";

const householdProfiles = [
  { id: "me", label: "Me", status: "good" as const, note: "All core checkups current" },
  { id: "dad", label: "Dad", status: "soon" as const, note: "Cardiology due in 18 days" },
  { id: "sofi", label: "Sofi", status: "overdue" as const, note: "Pediatric follow-up overdue" },
];

const defaultHouseholdProfile = householdProfiles[0]!;

export function DashboardFoundationScreen() {
  const router = useRouter();
  const activeProfileId = useActiveProfileStore((state) => state.activeProfileId);
  const setActiveProfileId = useActiveProfileStore(
    (state) => state.setActiveProfileId,
  );

  const activeProfile =
    householdProfiles.find((profile) => profile.id === activeProfileId) ??
    defaultHouseholdProfile;

  return (
    <Screen
      header={
        <View className="gap-1">
          <AppText variant="eyebrow">Household dashboard</AppText>
          <AppText variant="title">
            Multi-profile navigation and status visuals are ready to extend.
          </AppText>
        </View>
      }
    >
      <View className="gap-6">
        <HealthCard eyebrow="Profile switcher" title="Household context">
          <View className="flex-row flex-wrap gap-2">
            {householdProfiles.map((profile) => (
              <Chip
                key={profile.id}
                active={activeProfile.id === profile.id}
                label={profile.label}
                onPress={() => setActiveProfileId(profile.id)}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <StatusRing label={activeProfile.label} tone={activeProfile.status} />
            <View className="flex-1 gap-2">
              <AppText className="font-label text-slate-800">
                {activeProfile.label}
              </AppText>
              <AppText>{activeProfile.note}</AppText>
            </View>
          </View>
        </HealthCard>

        <ScreenSection className="gap-4">
          <HealthCard eyebrow="North star" title="Dashboard modules">
            <View className="gap-4">
              <View className="flex-row gap-3">
                <HeartPulse color="#0D9488" size={20} />
                <View className="flex-1 gap-1">
                  <AppText className="font-label text-slate-800">
                    Recommendation engine slot
                  </AppText>
                  <AppText>
                    Profile-driven checkup cards can land here without changing
                    the navigation shell.
                  </AppText>
                </View>
              </View>

              <View className="flex-row gap-3">
                <CalendarClock color="#3B82F6" size={20} />
                <View className="flex-1 gap-1">
                  <AppText className="font-label text-slate-800">
                    Last-performed timeline
                  </AppText>
                  <AppText>
                    Ready for next-due date calculation and manual logging flows.
                  </AppText>
                </View>
              </View>

              <View className="flex-row gap-3">
                <Bell color="#F43F5E" size={20} />
                <View className="flex-1 gap-1">
                  <AppText className="font-label text-slate-800">
                    Notification center entry point
                  </AppText>
                  <AppText>
                    The layout already has space for snooze actions and due-soon
                    messaging.
                  </AppText>
                </View>
              </View>
            </View>
          </HealthCard>

          <AppButton
            label="Design system preview"
            onPress={() => router.push("/design-system")}
            variant="secondary"
          />
        </ScreenSection>
      </View>
    </Screen>
  );
}
