import {
  type FinalizeOnboardingRequest,
  type OnboardingProfileInput,
  type ProfileCheckupInput,
} from "@repo/validation";

export class FinalizeOnboardingRequestDto implements FinalizeOnboardingRequest {
  readonly expoPushToken?: string;
  readonly profiles!: OnboardingProfileInput[];
}

export type FinalizeOnboardingProfileDto = OnboardingProfileInput;
export type FinalizeOnboardingProfileCheckupDto = ProfileCheckupInput;
