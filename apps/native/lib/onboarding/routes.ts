import type { ProfileDraft } from "./store";

export function getProfileStepRoute(profile: ProfileDraft) {
  if (!profile.completedSteps.identity) {
    return `/onboarding/profile/${profile.draftId}/identity` as const;
  }

  if (!profile.completedSteps.health) {
    return `/onboarding/profile/${profile.draftId}/health` as const;
  }

  if (!profile.completedSteps.checkups) {
    return `/onboarding/profile/${profile.draftId}/checkups` as const;
  }

  if (!profile.completedSteps.records) {
    return `/onboarding/profile/${profile.draftId}/records` as const;
  }

  return `/onboarding/profile/${profile.draftId}/review` as const;
}

export function getResumeOnboardingRoute(profiles: ProfileDraft[]) {
  if (profiles.length === 0) {
    return "/onboarding/tracking" as const;
  }

  const incompleteProfile = profiles.find(
    (profile) => !profile.completedSteps.review,
  );

  if (!incompleteProfile) {
    return "/onboarding/review" as const;
  }

  return getProfileStepRoute(incompleteProfile);
}
