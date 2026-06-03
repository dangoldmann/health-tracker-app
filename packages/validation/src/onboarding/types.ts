import z from "zod";
import {
  profileRelationshipSchema,
  biologicalSexSchema,
  checkupTypeSlugSchema,
  checkupRecordInputSchema,
  profileCheckupInputSchema,
  onboardingProfileInputSchema,
  finalizeOnboardingRequestSchema,
  finalizeOnboardingProfileCheckupResponseSchema,
  finalizeOnboardingProfileResponseSchema,
  finalizeOnboardingResponseSchema,
} from "./schemas";

export type OnboardingQueueEntry = {
  draftId: string;
  label: string;
  relationship: ProfileRelationship;
};

export type BuildOnboardingQueueInput = {
  includeSelf: boolean;
  childCount: number;
  parentCount: number;
};

export type OnboardingRecommendationProfileDraft = {
  birthDate: string;
  biologicalSex: BiologicalSex;
  relationship: ProfileRelationship;
  healthInfo?: Partial<{
    riskFactors: Partial<{
      smoker: boolean;
      hasHypertension: boolean;
      hasFamilyHistory: boolean;
    }>;
  }>;
};

export type RecommendedProfileCheckup = ProfileCheckupInput & {
  reason: string;
};

export type ProfileRelationship = z.infer<typeof profileRelationshipSchema>;
export type BiologicalSex = z.infer<typeof biologicalSexSchema>;
export type CheckupTypeSlug = z.infer<typeof checkupTypeSlugSchema>;
export type CheckupRecordInput = z.infer<typeof checkupRecordInputSchema>;
export type ProfileCheckupInput = z.infer<typeof profileCheckupInputSchema>;
export type OnboardingProfileInput = z.infer<
  typeof onboardingProfileInputSchema
>;
export type FinalizeOnboardingRequest = z.infer<
  typeof finalizeOnboardingRequestSchema
>;
export type FinalizeOnboardingProfileCheckupResponse = z.infer<
  typeof finalizeOnboardingProfileCheckupResponseSchema
>;
export type FinalizeOnboardingProfileResponse = z.infer<
  typeof finalizeOnboardingProfileResponseSchema
>;
export type FinalizeOnboardingResponse = z.infer<
  typeof finalizeOnboardingResponseSchema
>;
