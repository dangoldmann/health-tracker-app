import {
  biologicalSexValues,
  checkupTypeCatalog,
  checkupTypeSlugSchema,
  type BiologicalSex,
  type CheckupTypeSlug,
} from "@repo/validation";
import { z } from "zod";

const localBiologicalSexSchema = z.enum(biologicalSexValues);
const localCheckupTypeSlugSchema = z.enum(
  checkupTypeCatalog.map((checkupType) => checkupType.slug) as [
    CheckupTypeSlug,
    ...CheckupTypeSlug[],
  ],
);

export const identityStepSchema = z.object({
  biologicalSex: localBiologicalSexSchema,
  birthDate: z.iso.date(),
  name: z.string().trim().min(1, "Name is required.").max(120),
});

export const authFormSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const profileCheckupDraftSchema = z.object({
  checkupTypeSlug: localCheckupTypeSlugSchema,
  enabled: z.boolean(),
  frequencyDays: z.coerce
    .number()
    .int("Use whole days.")
    .positive("Frequency must be positive."),
  initialPerformedAt: z.iso.date().optional(),
  source: z.enum(["added", "recommended"]),
});

export type IdentityStepValues = z.infer<typeof identityStepSchema>;
export type AuthFormValues = z.infer<typeof authFormSchema>;

export function parseIdentityStep(values: {
  biologicalSex?: BiologicalSex;
  birthDate?: string;
  name?: string;
}) {
  return identityStepSchema.safeParse(values);
}

export function isCheckupSlug(value: string): value is CheckupTypeSlug {
  return checkupTypeSlugSchema.safeParse(value).success;
}
