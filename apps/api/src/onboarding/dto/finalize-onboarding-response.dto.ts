import type { ProfileRelationship } from "../../generated/prisma/client";

interface FinalizeOnboardingProfileCheckupResponseInput {
  id: string;
  checkupTypeSlug: string;
}

interface FinalizeOnboardingProfileResponseInput {
  id: string;
  name: string;
  relationship: ProfileRelationship;
  checkups: FinalizeOnboardingProfileCheckupResponseInput[];
}

interface FinalizeOnboardingResponseInput {
  userId: string;
  status: "created" | "existing";
  alreadyFinalized: boolean;
  profiles: FinalizeOnboardingProfileResponseInput[];
}

export class FinalizeOnboardingProfileCheckupResponseDto {
  readonly id: string;
  readonly checkupTypeSlug: string;

  private constructor(input: FinalizeOnboardingProfileCheckupResponseInput) {
    this.id = input.id;
    this.checkupTypeSlug = input.checkupTypeSlug;
  }

  static from(
    input: FinalizeOnboardingProfileCheckupResponseInput,
  ): FinalizeOnboardingProfileCheckupResponseDto {
    return new FinalizeOnboardingProfileCheckupResponseDto(input);
  }
}

export class FinalizeOnboardingProfileResponseDto {
  readonly id: string;
  readonly name: string;
  readonly relationship: ProfileRelationship;
  readonly checkups: FinalizeOnboardingProfileCheckupResponseDto[];

  private constructor(input: FinalizeOnboardingProfileResponseInput) {
    this.id = input.id;
    this.name = input.name;
    this.relationship = input.relationship;
    this.checkups = input.checkups.map((checkup) =>
      FinalizeOnboardingProfileCheckupResponseDto.from(checkup),
    );
  }

  static from(
    input: FinalizeOnboardingProfileResponseInput,
  ): FinalizeOnboardingProfileResponseDto {
    return new FinalizeOnboardingProfileResponseDto(input);
  }
}

export class FinalizeOnboardingResponseDto {
  readonly userId: string;
  readonly status: "created" | "existing";
  readonly alreadyFinalized: boolean;
  readonly profiles: FinalizeOnboardingProfileResponseDto[];

  private constructor(input: FinalizeOnboardingResponseInput) {
    this.userId = input.userId;
    this.status = input.status;
    this.alreadyFinalized = input.alreadyFinalized;
    this.profiles = input.profiles.map((profile) =>
      FinalizeOnboardingProfileResponseDto.from(profile),
    );
  }

  static from(
    input: FinalizeOnboardingResponseInput,
  ): FinalizeOnboardingResponseDto {
    return new FinalizeOnboardingResponseDto(input);
  }
}
