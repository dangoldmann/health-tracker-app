import {
  biologicalSexSchema,
  checkupTypeSlugSchema,
  type CheckupTypeSlug,
} from "@repo/validation";
import { z } from "zod";

export const identityStepSchema = z.object({
  biologicalSex: biologicalSexSchema,
  birthDate: z.iso.date(),
  name: z.string().trim().min(1, "Name is required.").max(120),
});

export const authFormSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const profileCheckupDraftSchema = z.object({
  checkupTypeSlug: checkupTypeSlugSchema,
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

export function isCheckupSlug(value: string): value is CheckupTypeSlug {
  return checkupTypeSlugSchema.safeParse(value).success;
}
