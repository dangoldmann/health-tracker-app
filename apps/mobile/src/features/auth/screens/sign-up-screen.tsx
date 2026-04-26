import { z } from "zod";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { AppButton } from "@/components/ui/app-button";
import { AppText } from "@/components/ui/app-text";
import { HealthCard } from "@/components/ui/health-card";
import { Screen } from "@/components/ui/screen";
import { useAuth } from "@/providers/auth-provider";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password."),
});

export function SignUpScreen() {
  const router = useRouter();
  const { clearBootstrapError, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const parsedInput = signUpSchema.safeParse({ email, password });

    if (!parsedInput.success) {
      setError(parsedInput.error.issues[0]?.message ?? "Check your details.");
      return;
    }

    setError(null);
    clearBootstrapError();
    setIsSubmitting(true);

    try {
      await signUp(parsedInput.data);
      router.replace(
        ({
          params: { email: parsedInput.data.email },
          pathname: "/verify-email",
        } as unknown) as Href,
      );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="gap-8 py-4">
        <View className="gap-3">
          <AppText variant="eyebrow">Sign up</AppText>
          <AppText variant="headline">
            Create your account, then verify your email.
          </AppText>
          <AppText>
            Onboarding starts only after Supabase confirms the address you use
            here.
          </AppText>
        </View>

        <HealthCard eyebrow="New account" title="Set up your credentials">
          <View className="gap-4">
            <Field
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              label="Email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              value={email}
            />
            <Field
              autoCapitalize="none"
              autoComplete="new-password"
              label="Password"
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              secureTextEntry
              value={password}
            />

            {error ? (
              <View className="rounded-2xl border border-alert/20 bg-alert/10 px-4 py-3">
                <AppText className="text-alert">{error}</AppText>
              </View>
            ) : null}

            <AppButton
              label="Create account"
              loading={isSubmitting}
              onPress={() => void handleSubmit()}
            />
          </View>
        </HealthCard>

        <View className="gap-3">
          <Link href={"/sign-in" as Href} asChild>
            <Pressable className="rounded-2xl border border-border bg-surface px-5 py-4">
              <AppText className="text-center font-label text-secondary">
                Already have an account? Sign in
              </AppText>
            </Pressable>
          </Link>

          <Pressable
            className="py-2"
            onPress={() => router.replace("/")}
          >
            <AppText className="text-center font-label text-textMuted">
              Back to landing
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

interface FieldProps {
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: TextInputProps["autoComplete"];
  keyboardType?: "default" | "email-address";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
}

function Field({
  autoCapitalize = "sentences",
  autoComplete,
  keyboardType = "default",
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  value,
}: FieldProps) {
  return (
    <View className="gap-2">
      <AppText className="font-label text-slate-800">{label}</AppText>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        className="min-h-14 rounded-2xl border border-border bg-slate-50 px-4 font-body text-base text-text"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        value={value}
      />
    </View>
  );
}
