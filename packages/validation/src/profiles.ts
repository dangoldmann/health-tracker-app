import { z } from "zod";

export const biologicalSexSchema = z.enum(["MALE", "FEMALE", "OTHER"]);

const riskFactorValueSchema = z.union([z.boolean(), z.string(), z.number()]);

export const riskFactorsSchema = z.record(riskFactorValueSchema).default({});

const rawCreateProfileSchema = z.object({
  name: z.string().min(1).max(120),
  isSelf: z.boolean().default(false),
  birthDate: z.string().date(),
  biologicalSex: biologicalSexSchema,
  riskFactors: riskFactorsSchema.optional(),
  metadata: riskFactorsSchema.optional(),
  insuranceProviderId: z.string().min(1).optional(),
  familyGroupId: z.string().uuid().optional(),
});

export const createProfileSchema = rawCreateProfileSchema.transform(
  ({ metadata, riskFactors, ...rest }) => ({
    ...rest,
    riskFactors: riskFactors ?? metadata ?? {},
  }),
);

export const profileIdParamSchema = z.object({
  profileId: z.string().uuid(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
