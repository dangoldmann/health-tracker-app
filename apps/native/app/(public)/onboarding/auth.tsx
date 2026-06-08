import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { getMe } from "../../../lib/api";
import { AppButton } from "../../../components/app-button";
import { ErrorText, FormField } from "../../../components/form-field";
import { OnboardingStepScreen } from "../../../components/onboarding";
import { Pressable, Text, View } from "../../../components/ui";
import { useAuthProvider } from "../../../lib/auth-provider";
import { finalizeOnboarding } from "../../../lib/api";
import {
  authFormSchema,
  createFinalizePayload,
  getOnboardingProgress,
  useOnboardingStore,
  type AuthFormValues,
} from "../../../lib/onboarding";
import { getCurrentSession, getSupabaseClient } from "../../../lib/supabase";

export default function FinalAuthScreen() {
  const router = useRouter();
  const { setAuthenticatedSession } = useAuthProvider();
  const profiles = useOnboardingStore((state) => state.profiles);
  const clearDraft = useOnboardingStore((state) => state.clearDraft);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch,
  } = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const values = watch();
  const finalizeMutation = useMutation({
    mutationFn: ({
      accessToken,
      payload,
    }: {
      accessToken: string;
      payload: ReturnType<typeof createFinalizePayload>;
    }) => finalizeOnboarding(accessToken, payload),
  });

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmissionError(null);
    const parsed = authFormSchema.safeParse(formValues);

    if (!parsed.success) {
      setSubmissionError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }

    let payload: ReturnType<typeof createFinalizePayload>;

    try {
      payload = createFinalizePayload(profiles);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Review the onboarding draft before finalizing.",
      );
      return;
    }

    const {
      data: { session },
      error,
    } = await getSupabaseClient().auth.signUp(parsed.data);

    if (error) {
      setSubmissionError(error.message);
      return;
    }

    const activeSession = session ?? (await getCurrentSession());

    if (!activeSession?.access_token) {
      setSubmissionError(
        "Account was created but no active session was returned. Please log in to finish onboarding.",
      );
      return;
    }

    try {
      await finalizeMutation.mutateAsync({
        accessToken: activeSession.access_token,
        payload,
      });
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Finalization failed. You can retry without losing the draft.",
      );
      return;
    }

    let me;

    try {
      me = await getMe(activeSession.access_token);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Could not load your account after finalization.",
      );
      return;
    }

    clearDraft();
    setAuthenticatedSession(activeSession, me);
    router.replace("/");
  });

  const isBusy = isSubmitting || finalizeMutation.isPending;

  return (
    <OnboardingStepScreen
      footer={
        <View className="gap-3">
          <Text
            className="text-center text-[12px] text-text-primary/45"
            style={{ lineHeight: 18, fontFamily: "Geist" }}
          >
            By continuing you agree to our Terms and Privacy Policy.
          </Text>
          <AppButton
            disabled={isBusy}
            label={isBusy ? "Creating account..." : "Finish & create account"}
            onPress={onSubmit}
          />
        </View>
      }
      progress={getOnboardingProgress(profiles)}
      subtitle="Almost done. This locks in everything you've set up."
      title={"Create your\naccount."}
      titleSize={42}
    >
      <View className="mt-4 gap-6">
        <FormField
          autoCapitalize="none"
          autoComplete="email"
          inputMode="email"
          label="Email"
          onBlur={register("email").onBlur}
          onChangeText={(value) => setValue("email", value)}
          placeholder="you@email.com"
          value={values.email}
        />
        <FormField
          label="Password"
          onBlur={register("password").onBlur}
          onChangeText={(value) => setValue("password", value)}
          placeholder="At least 8 characters"
          rightSlot={
            <Pressable
              accessibilityLabel={
                isPasswordVisible ? "Hide password" : "Show password"
              }
              accessibilityRole="button"
              hitSlop={12}
              onPress={() => setIsPasswordVisible((visible) => !visible)}
            >
              <Feather
                color="#6B7771"
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={20}
              />
            </Pressable>
          }
          secureTextEntry={!isPasswordVisible}
          value={values.password}
        />
        <ErrorText>{submissionError}</ErrorText>
      </View>
    </OnboardingStepScreen>
  );
}
