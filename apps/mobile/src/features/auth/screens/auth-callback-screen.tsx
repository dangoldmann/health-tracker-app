import * as Linking from "expo-linking";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { ErrorCard } from "@/components/ui/error-card";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";
import { theme } from "@/lib/constants/theme";
import { useAuth } from "@/providers/auth-provider";

export function AuthCallbackScreen() {
  const { bootstrapError, handleAuthCallback, retrySessionSync, signOut } =
    useAuth();
  const url = Linking.useURL();
  const handledUrlRef = useRef<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!url || handledUrlRef.current === url) {
      return;
    }

    handledUrlRef.current = url;

    void (async () => {
      try {
        await handleAuthCallback(url);
      } catch (error) {
        setLocalError(
          error instanceof Error
            ? error.message
            : "We could not finish the email verification handoff.",
        );
      }
    })();
  }, [handleAuthCallback, url]);

  const errorMessage = localError ?? bootstrapError;

  return (
    <Screen contentClassName="justify-center py-16">
      {errorMessage ? (
        <ErrorCard
          actionLabel="Retry sync"
          description={errorMessage}
          loading={isRetrying}
          onAction={() => {
            void (async () => {
              setLocalError(null);
              setIsRetrying(true);

              try {
                if (url) {
                  await handleAuthCallback(url);
                } else {
                  await retrySessionSync();
                }
              } catch (error) {
                setLocalError(
                  error instanceof Error
                    ? error.message
                    : "We could not finish the email verification handoff.",
                );
              } finally {
                setIsRetrying(false);
              }
            })();
          }}
          onSecondaryAction={() => void signOut()}
          secondaryActionLabel="Sign out"
          title="We couldn't finish email verification"
        />
      ) : (
        <HealthCard eyebrow="Signing you in" title="Finishing email verification">
          <View className="gap-4">
            <ActivityIndicator color={theme.colors.primary} size="large" />
            <AppText>
              Restoring your session, syncing your account, and getting
              onboarding ready.
            </AppText>
          </View>
        </HealthCard>
      )}
    </Screen>
  );
}
