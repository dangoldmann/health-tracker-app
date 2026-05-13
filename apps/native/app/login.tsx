import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";

import { getMe } from "../lib/api";
import { meQueryKey, sessionQueryKey } from "../lib/auth-queries";
import { authFormSchema, type AuthFormValues } from "../lib/onboarding/forms";
import { useOnboardingStore } from "../lib/onboarding/store";
import { getResumeOnboardingRoute } from "../lib/onboarding/routes";
import { getSupabaseClient } from "../lib/supabase";
import {
  AppButton,
  Card,
  ErrorText,
  FormField,
  StepScreen,
} from "../components/onboarding-ui";
import { Text, View } from "../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const profiles = useOnboardingStore((state) => state.profiles);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const {
    formState: { errors, isSubmitting },
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

  const onSubmit = handleSubmit(async (formValues) => {
    setSubmissionError(null);
    const parsed = authFormSchema.safeParse(formValues);

    if (!parsed.success) {
      setSubmissionError(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }
    const {
      data: { session },
      error,
    } = await getSupabaseClient().auth.signInWithPassword(parsed.data);

    if (error) {
      setSubmissionError(error.message);
      return;
    }

    if (!session?.access_token) {
      setSubmissionError("Sign-in did not return a session.");
      return;
    }

    let me;

    try {
      me = await getMe(session.access_token);
    } catch (requestError) {
      console.log(requestError);
      setSubmissionError(
        requestError instanceof Error
          ? requestError.message
          : "Could not check your account status.",
      );
      return;
    }

    await queryClient.invalidateQueries({ queryKey: sessionQueryKey });
    queryClient.setQueryData(meQueryKey, me);

    router.replace(me.user ? "/home" : getResumeOnboardingRoute(profiles));
  });

  return (
    <StepScreen
      subtitle="Use the email and password connected to your health tracker account."
      title="Login"
    >
      <Card>
        <View className="gap-4">
          <FormField
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email?.message}
            inputMode="email"
            label="Email"
            onBlur={register("email").onBlur}
            onChangeText={(value) => setValue("email", value)}
            value={values.email}
          />
          <FormField
            error={errors.password?.message}
            label="Password"
            onBlur={register("password").onBlur}
            onChangeText={(value) => setValue("password", value)}
            secureTextEntry
            value={values.password}
          />
          <ErrorText>{submissionError}</ErrorText>
          <AppButton
            disabled={isSubmitting}
            label={isSubmitting ? "Signing in..." : "Sign in"}
            onPress={onSubmit}
          />
        </View>
      </Card>

      <View className="rounded-[24px] border border-[#E4DED0] bg-[#FFFDF8] p-5">
        <Text className="text-sm leading-6 text-[#66736D]">
          New here?{" "}
          <Link
            href="/onboarding/tracking"
            style={{ color: "#0F766E", fontWeight: "700" }}
          >
            Start onboarding
          </Link>
        </Text>
      </View>
    </StepScreen>
  );
}
