import {
  RecommendedProfileCheckup,
  CheckupTypeSlug,
  OnboardingRecommendationProfileDraft,
} from "./types";

function calculateAgeInYears(
  birthDate: string,
  today = new Date(),
): number | null {
  const parsedBirthDate = new Date(`${birthDate}T00:00:00.000Z`);

  if (Number.isNaN(parsedBirthDate.getTime())) {
    return null;
  }

  let age = today.getUTCFullYear() - parsedBirthDate.getUTCFullYear();
  const birthdayThisYear = Date.UTC(
    today.getUTCFullYear(),
    parsedBirthDate.getUTCMonth(),
    parsedBirthDate.getUTCDate(),
  );

  if (today.getTime() < birthdayThisYear) {
    age -= 1;
  }

  return age;
}

export function hasSelfCardiologyRiskFactor(
  draft: OnboardingRecommendationProfileDraft,
): boolean {
  if (draft.relationship !== "SELF") {
    return false;
  }

  const riskFactors = draft.healthInfo?.riskFactors;

  return Boolean(
    riskFactors?.smoker ||
    riskFactors?.hasHypertension ||
    riskFactors?.hasFamilyHistory,
  );
}

type AddRecommendation = (
  checkupTypeSlug: CheckupTypeSlug,
  frequencyDays: number,
  reason: string,
) => void;

type RecommendationContext = {
  draft: OnboardingRecommendationProfileDraft;
  today: Date;
  age: number | null;
  isAdult: boolean;
};

type RecommendationRule = (
  context: RecommendationContext,
  addRecommendation: AddRecommendation,
) => void;

function addChildBaselineRecommendations(
  { draft }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (draft.relationship !== "CHILD") {
    return;
  }

  addRecommendation("pediatrics", 180, "Common child wellness follow-up");
  addRecommendation("dentistry", 180, "Common child dental follow-up");
}

function addParentBaselineRecommendations(
  { draft }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (draft.relationship !== "PARENT") {
    return;
  }

  addRecommendation("cardiology", 180, "Parent baseline recommendation");
  addRecommendation("ophthalmology", 365, "Parent baseline recommendation");
  addRecommendation("dentistry", 180, "Parent baseline recommendation");
}

function addAdultBaselineRecommendations(
  { isAdult }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (!isAdult) {
    return;
  }

  addRecommendation("dentistry", 180, "Adult baseline recommendation");
  addRecommendation("dermatology", 365, "Adult baseline recommendation");
}

function addFemaleAdultRecommendations(
  { draft, isAdult }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (!isAdult || draft.biologicalSex !== "FEMALE") {
    return;
  }

  addRecommendation("gynecology", 365, "Female adult recommendation");
}

function addAdult40PlusRecommendations(
  { age, isAdult }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (!isAdult || age === null || age < 40) {
    return;
  }

  addRecommendation("ophthalmology", 365, "Adult age 40+ recommendation");
  addRecommendation("cardiology", 365, "Adult age 40+ recommendation");
}

function addSelfRiskFactorRecommendations(
  { draft, isAdult }: RecommendationContext,
  addRecommendation: AddRecommendation,
): void {
  if (!isAdult || !hasSelfCardiologyRiskFactor(draft)) {
    return;
  }

  addRecommendation("cardiology", 365, "Self risk-factor recommendation");
}

const recommendationRules: RecommendationRule[] = [
  addChildBaselineRecommendations,
  addParentBaselineRecommendations,
  addAdultBaselineRecommendations,
  addFemaleAdultRecommendations,
  addAdult40PlusRecommendations,
  addSelfRiskFactorRecommendations,
];

export function getRecommendedCheckupsForProfile(
  draft: OnboardingRecommendationProfileDraft,
  today = new Date(),
): RecommendedProfileCheckup[] {
  const age = calculateAgeInYears(draft.birthDate, today);
  const isAdult = draft.relationship !== "CHILD" && age !== null && age >= 18;
  const context: RecommendationContext = {
    draft,
    today,
    age,
    isAdult,
  };
  const recommendations = new Map<CheckupTypeSlug, RecommendedProfileCheckup>();

  const addRecommendation: AddRecommendation = (
    checkupTypeSlug: CheckupTypeSlug,
    frequencyDays: number,
    reason: string,
  ) => {
    const existing = recommendations.get(checkupTypeSlug);

    if (existing && existing.frequencyDays <= frequencyDays) {
      return;
    }

    recommendations.set(checkupTypeSlug, {
      checkupTypeSlug,
      frequencyDays,
      reason,
    });
  };

  for (const rule of recommendationRules) {
    rule(context, addRecommendation);
  }

  return Array.from(recommendations.values());
}
