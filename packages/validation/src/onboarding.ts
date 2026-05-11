import { z } from "zod";

export const profileRelationshipValues = ["SELF", "PARENT", "CHILD"] as const;
export const biologicalSexValues = ["MALE", "FEMALE", "OTHER"] as const;

export const checkupTypeCatalog = [
  {
    slug: "cardiology",
    name: "Cardiology",
  },
  {
    slug: "dentistry",
    name: "Dentistry",
  },
  {
    slug: "dermatology",
    name: "Dermatology",
  },
  {
    slug: "gynecology",
    name: "Gynecology",
  },
  {
    slug: "ophthalmology",
    name: "Ophthalmology",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
  },
] as const;

export const profileRelationshipSchema = z.enum(profileRelationshipValues);
export const biologicalSexSchema = z.enum(biologicalSexValues);
export const checkupTypeSlugSchema = z.enum(
  checkupTypeCatalog.map((checkupType) => checkupType.slug) as [
    (typeof checkupTypeCatalog)[number]["slug"],
    ...(typeof checkupTypeCatalog)[number]["slug"][],
  ],
);

const isoDateSchema = z.iso.date();

const selfHealthInfoSchema = z.object({
  riskFactors: z.object({
    smoker: z.boolean(),
    hasHypertension: z.boolean(),
    hasFamilyHistory: z.boolean(),
  }),
});

const parentHealthInfoSchema = z.object({
  concerns: z.object({
    hasDiabetes: z.boolean(),
    hasMobilityIssues: z.boolean(),
    hasCognitiveConcerns: z.boolean(),
  }),
});

const childHealthInfoSchema = z.object({
  concerns: z.object({
    hasAllergies: z.boolean(),
    hasAsthma: z.boolean(),
  }),
});

export const checkupRecordInputSchema = z.object({
  performedAt: isoDateSchema,
  comments: z.string().trim().min(1).max(1_000).optional(),
  doctorNotes: z.string().trim().min(1).max(1_000).optional(),
});

export const profileCheckupInputSchema = z.object({
  checkupTypeSlug: checkupTypeSlugSchema,
  frequencyDays: z.number().int().positive(),
  initialRecord: checkupRecordInputSchema.optional(),
});

const baseProfileInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  birthDate: isoDateSchema,
  biologicalSex: biologicalSexSchema.optional(),
  checkups: z
    .array(profileCheckupInputSchema)
    .min(1)
    .superRefine((checkups, ctx) => {
      const seen = new Set<string>();

      for (const [index, checkup] of checkups.entries()) {
        if (seen.has(checkup.checkupTypeSlug)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate checkup type slug '${checkup.checkupTypeSlug}'.`,
            path: [index, "checkupTypeSlug"],
          });
          continue;
        }

        seen.add(checkup.checkupTypeSlug);
      }
    }),
});

export const selfProfileInputSchema = baseProfileInputSchema.extend({
  relationship: z.literal("SELF"),
  healthInfo: selfHealthInfoSchema,
});

export const parentProfileInputSchema = baseProfileInputSchema.extend({
  relationship: z.literal("PARENT"),
  healthInfo: parentHealthInfoSchema,
});

export const childProfileInputSchema = baseProfileInputSchema.extend({
  relationship: z.literal("CHILD"),
  healthInfo: childHealthInfoSchema,
});

export const onboardingProfileInputSchema = z.discriminatedUnion("relationship", [
  selfProfileInputSchema,
  parentProfileInputSchema,
  childProfileInputSchema,
]);

export const finalizeOnboardingRequestSchema = z.object({
  expoPushToken: z.string().trim().min(1).max(255).optional(),
  profiles: z
    .array(onboardingProfileInputSchema)
    .min(1)
    .superRefine((profiles, ctx) => {
      const selfProfiles = profiles.filter(
        (profile) => profile.relationship === "SELF",
      );

      if (selfProfiles.length > 1) {
        ctx.addIssue({
          code: "custom",
          message: "Only one SELF profile can be submitted.",
          path: [],
        });
      }
    }),
});

export type ProfileRelationship = z.infer<typeof profileRelationshipSchema>;
export type BiologicalSex = z.infer<typeof biologicalSexSchema>;
export type CheckupTypeSlug = z.infer<typeof checkupTypeSlugSchema>;
export type CheckupRecordInput = z.infer<typeof checkupRecordInputSchema>;
export type ProfileCheckupInput = z.infer<typeof profileCheckupInputSchema>;
export type OnboardingProfileInput = z.infer<typeof onboardingProfileInputSchema>;
export type FinalizeOnboardingRequest = z.infer<
  typeof finalizeOnboardingRequestSchema
>;
