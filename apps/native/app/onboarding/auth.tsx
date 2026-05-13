import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

import {
  AppButton,
  Card,
  ErrorText,
  FormField,
  StepScreen,
} from "../../components/onboarding-ui";
import { Text, View } from "../../components/ui";
import { finalizeOnboarding } from "../../lib/api";
import { meQueryKey, sessionQueryKey } from "../../lib/auth-queries";
import {
  authFormSchema,
  type AuthFormValues,
} from "../../lib/onboarding/forms";
import {
  useOnboardingStore,
  createFinalizePayload,
} from "../../lib/onboarding/store";
import { getCurrentSession, getSupabaseClient } from "../../lib/supabase";

export default function FinalAuthScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profiles = useOnboardingStore((state) => state.profiles);
  const clearDraft = useOnboardingStore((state) => state.clearDraft);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
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
    console.log(clearDraft);
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

    clearDraft();
    await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    await queryClient.invalidateQueries({ queryKey: meQueryKey });
    router.replace("/home");
  });

  const isBusy = isSubmitting || finalizeMutation.isPending;

  return (
    <StepScreen
      progress={0.96}
      subtitle="Create the auth account, then the app will send the completed onboarding payload to the API."
      title="Create your account"
    >
      <Card>
        <View className="gap-4">
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            inputMode="email"
            label="Email"
            onBlur={register("email").onBlur}
            onChangeText={(value) => setValue("email", value)}
            value={values.email}
          />
          <FormField
            label="Password"
            onBlur={register("password").onBlur}
            onChangeText={(value) => setValue("password", value)}
            secureTextEntry
            value={values.password}
          />
          <ErrorText>{submissionError}</ErrorText>
          <AppButton
            disabled={isBusy}
            label={isBusy ? "Creating account..." : "Create account and finish"}
            onPress={onSubmit}
          />
          <AppButton
            disabled
            label="Continue with Google · Soon"
            tone="secondary"
          />
        </View>
      </Card>
      <Text className="px-2 text-sm leading-6 text-[#66736D]">
        If this email is already registered, the error stays here. Login remains
        a separate path.
      </Text>
    </StepScreen>
  );
}
