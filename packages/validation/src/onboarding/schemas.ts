import z from "zod";
import {
  biologicalSexValues,
  profileRelationshipValues,
  checkupTypeCatalog,
  MAX_CHILD_PROFILES,
  MAX_PARENT_PROFILES,
  MAX_SELF_PROFILES,
} from "./constants";

const isoDateSchema = z.iso.date();

export const profileRelationshipSchema = z.enum(profileRelationshipValues);

export const biologicalSexSchema = z.enum(biologicalSexValues);

export const checkupTypeSlugSchema = z.enum(
  checkupTypeCatalog.map((checkupType) => checkupType.slug) as [
    (typeof checkupTypeCatalog)[number]["slug"],
    ...(typeof checkupTypeCatalog)[number]["slug"][],
  ],
);

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

const baseProfileInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  birthDate: isoDateSchema,
  biologicalSex: biologicalSexSchema,
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

export const onboardingProfileInputSchema = z.discriminatedUnion(
  "relationship",
  [selfProfileInputSchema, parentProfileInputSchema, childProfileInputSchema],
);

export const finalizeOnboardingRequestSchema = z.object({
  expoPushToken: z.string().trim().min(1).max(255).optional(),
  profiles: z
    .array(onboardingProfileInputSchema)
    .min(1)
    .superRefine((profiles, ctx) => {
      const selfProfiles = profiles.filter(
        (profile) => profile.relationship === "SELF",
      );

      if (selfProfiles.length > MAX_SELF_PROFILES) {
        ctx.addIssue({
          code: "custom",
          message: `Only ${MAX_SELF_PROFILES} SELF profile can be submitted.`,
          path: [],
        });
      }

      const childProfiles = profiles.filter(
        (profile) => profile.relationship === "CHILD",
      );

      if (childProfiles.length > MAX_CHILD_PROFILES) {
        ctx.addIssue({
          code: "custom",
          message: `At most ${MAX_CHILD_PROFILES} CHILD profiles can be submitted.`,
          path: [],
        });
      }

      const parentProfiles = profiles.filter(
        (profile) => profile.relationship === "PARENT",
      );

      if (parentProfiles.length > MAX_PARENT_PROFILES) {
        ctx.addIssue({
          code: "custom",
          message: `At most ${MAX_PARENT_PROFILES} PARENT profiles can be submitted.`,
          path: [],
        });
      }
    }),
});

export const finalizeOnboardingProfileCheckupResponseSchema = z.object({
  id: z.string().trim().min(1),
  checkupTypeSlug: checkupTypeSlugSchema,
});

export const finalizeOnboardingProfileResponseSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  relationship: profileRelationshipSchema,
  checkups: z.array(finalizeOnboardingProfileCheckupResponseSchema),
});

export const finalizeOnboardingResponseSchema = z.object({
  userId: z.string().trim().min(1),
  status: z.enum(["created", "existing"]),
  alreadyFinalized: z.boolean(),
  profiles: z.array(finalizeOnboardingProfileResponseSchema),
});
