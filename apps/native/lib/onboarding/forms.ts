import { biologicalSexSchema } from "@repo/validation";
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

export type IdentityStepValues = z.infer<typeof identityStepSchema>;
export type AuthFormValues = z.infer<typeof authFormSchema>;

export function createExactRecordDateSchema({
  birthDate,
}: {
  birthDate?: string;
}) {
  const todayIso = new Date().toISOString().slice(0, 10);

  return z.string().superRefine((value, ctx) => {
    if (!z.iso.date().safeParse(value).success) {
      ctx.addIssue({
        code: "custom",
        message: "Use YYYY-MM-DD for exact dates.",
      });
      return;
    }

    if (value > todayIso) {
      ctx.addIssue({
        code: "custom",
        message: "Date cannot be in the future.",
      });
      return;
    }

    if (birthDate && value < birthDate) {
      ctx.addIssue({
        code: "custom",
        message: "Date cannot be before the profile birth date.",
      });
    }
  });
}
