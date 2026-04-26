import { Text, type TextProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type TextVariant =
  | "body"
  | "button"
  | "caption"
  | "eyebrow"
  | "headline"
  | "sectionTitle"
  | "title";

const variantClassName: Record<TextVariant, string> = {
  body: "font-body text-base leading-6 text-slate-700",
  button: "font-label text-base text-text",
  caption: "font-label text-xs uppercase tracking-[0.16em] text-textMuted",
  eyebrow: "font-label text-sm text-primary",
  headline: "font-heading text-[32px] leading-10 text-text",
  sectionTitle: "font-heading text-lg leading-6 text-slate-800",
  title: "font-heading text-2xl leading-8 text-text",
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export function AppText({
  children,
  className,
  variant = "body",
  ...props
}: AppTextProps) {
  return (
    <Text className={cn(variantClassName[variant], className)} {...props}>
      {children}
    </Text>
  );
}
