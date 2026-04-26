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

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Enter your password."),
});

export function SignInScreen() {
  const router = useRouter();
  const { clearBootstrapError, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const parsedInput = signInSchema.safeParse({ email, password });

    if (!parsedInput.success) {
      setError(parsedInput.error.issues[0]?.message ?? "Check your details.");
      return;
    }

    setError(null);
    clearBootstrapError();
    setIsSubmitting(true);

    try {
      await signIn(parsedInput.data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to sign you in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen>
      <View className="gap-8 py-4">
        <View className="gap-3">
          <AppText variant="eyebrow">Sign in</AppText>
          <AppText variant="headline">Welcome back to HealthGuard.</AppText>
          <AppText>
            Use the email and password tied to your verified Supabase account.
          </AppText>
        </View>

        <HealthCard eyebrow="Account access" title="Email and password">
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
              autoComplete="password"
              label="Password"
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              value={password}
            />

            {error ? (
              <View className="rounded-2xl border border-alert/20 bg-alert/10 px-4 py-3">
                <AppText className="text-alert">{error}</AppText>
              </View>
            ) : null}

            <AppButton
              label="Sign in"
              loading={isSubmitting}
              onPress={() => void handleSubmit()}
            />
          </View>
        </HealthCard>

        <View className="gap-3">
          <Link href={"/sign-up" as Href} asChild>
            <Pressable className="rounded-2xl border border-border bg-surface px-5 py-4">
              <AppText className="text-center font-label text-secondary">
                Need an account? Sign up
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
