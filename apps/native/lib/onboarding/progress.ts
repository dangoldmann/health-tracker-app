import type { ProfileDraft } from "./store";

const perProfileStepCount = 5;
const globalStepCount = 2;

export function getOnboardingProgress(profiles: ProfileDraft[]) {
  if (profiles.length === 0) {
    return 0.05;
  }

  const completedProfileSteps = profiles.reduce((total, profile) => {
    return (
      total +
      Object.values(profile.completedSteps).filter((isComplete) => isComplete)
        .length
    );
  }, 0);

  const totalSteps = profiles.length * perProfileStepCount + globalStepCount;

  return completedProfileSteps / totalSteps;
}

export function getProfileContextLabel(
  profiles: ProfileDraft[],
  draftId: string,
) {
  const index = profiles.findIndex((profile) => profile.draftId === draftId);

  if (index < 0) {
    return undefined;
  }

  return `Profile ${index + 1} of ${profiles.length}`;
}
