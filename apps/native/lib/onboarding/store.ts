import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  buildOnboardingQueue,
  finalizeOnboardingRequestSchema,
  type BiologicalSex,
  type CheckupTypeSlug,
  type FinalizeOnboardingRequest,
  type OnboardingProfileInput,
  type ProfileRelationship,
} from "@repo/validation";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TrackingSelection = {
  child: boolean;
  parent: boolean;
  self: boolean;
};

export type ProfileHealthDraft = {
  child: {
    hasAllergies: boolean;
    hasAsthma: boolean;
  };
  parent: {
    hasCognitiveConcerns: boolean;
    hasDiabetes: boolean;
    hasMobilityIssues: boolean;
  };
  self: {
    hasFamilyHistory: boolean;
    hasHypertension: boolean;
    smoker: boolean;
  };
};

export type ProfileCheckupDraft = {
  checkupTypeSlug: CheckupTypeSlug;
  enabled: boolean;
  frequencyDays: number;
  initialPerformedAt?: string;
  source: "added" | "recommended";
};

export type ProfileDraft = {
  biologicalSex?: BiologicalSex;
  birthDate?: string;
  completedSteps: {
    checkups: boolean;
    health: boolean;
    identity: boolean;
    records: boolean;
    review: boolean;
  };
  draftId: string;
  health: ProfileHealthDraft;
  label: string;
  name?: string;
  relationship: ProfileRelationship;
  selectedCheckups: ProfileCheckupDraft[];
};

type ProfileCounts = {
  childCount: number;
  parentCount: number;
};

type ProfileStep = keyof ProfileDraft["completedSteps"];

type OnboardingState = {
  currentDraftId: string | null;
  profileCounts: ProfileCounts;
  profiles: ProfileDraft[];
  trackingSelection: TrackingSelection;
  buildQueue: () => void;
  clearDraft: () => void;
  completeProfileStep: (draftId: string, step: ProfileStep) => void;
  replaceProfileCheckups: (
    draftId: string,
    checkups: ProfileCheckupDraft[],
  ) => void;
  setCurrentDraftId: (draftId: string | null) => void;
  setProfileCounts: (counts: Partial<ProfileCounts>) => void;
  setProfileHealth: (
    draftId: string,
    health: Partial<ProfileHealthDraft>,
  ) => void;
  setProfileIdentity: (
    draftId: string,
    identity: {
      biologicalSex: BiologicalSex;
      birthDate: string;
      name: string;
    },
  ) => void;
  setProfileRecord: (
    draftId: string,
    checkupTypeSlug: CheckupTypeSlug,
    initialPerformedAt?: string,
  ) => void;
  setTrackingSelection: (selection: TrackingSelection) => void;
};

const defaultHealth: ProfileHealthDraft = {
  child: {
    hasAllergies: false,
    hasAsthma: false,
  },
  parent: {
    hasCognitiveConcerns: false,
    hasDiabetes: false,
    hasMobilityIssues: false,
  },
  self: {
    hasFamilyHistory: false,
    hasHypertension: false,
    smoker: false,
  },
};

const initialState = {
  currentDraftId: null,
  profileCounts: {
    childCount: 1,
    parentCount: 1,
  },
  profiles: [],
  trackingSelection: {
    child: false,
    parent: false,
    self: false,
  },
};

function createProfileDraft(
  draftId: string,
  relationship: ProfileRelationship,
  label: string,
): ProfileDraft {
  return {
    completedSteps: {
      checkups: false,
      health: false,
      identity: false,
      records: false,
      review: false,
    },
    draftId,
    health: defaultHealth,
    label,
    relationship,
    selectedCheckups: [],
  };
}

function updateProfile(
  profiles: ProfileDraft[],
  draftId: string,
  update: (profile: ProfileDraft) => ProfileDraft,
) {
  return profiles.map((profile) =>
    profile.draftId === draftId ? update(profile) : profile,
  );
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      buildQueue: () => {
        const { profileCounts, trackingSelection } = get();
        const queue = buildOnboardingQueue({
          includeSelf: trackingSelection.self,
          childCount: trackingSelection.child ? profileCounts.childCount : 0,
          parentCount: trackingSelection.parent ? profileCounts.parentCount : 0,
        });
        const profiles = queue.map((entry) =>
          createProfileDraft(entry.draftId, entry.relationship, entry.label),
        );

        set({
          currentDraftId: profiles[0]?.draftId ?? null,
          profiles,
        });
      },
      clearDraft: () => set(initialState),
      completeProfileStep: (draftId, step) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            completedSteps: {
              ...profile.completedSteps,
              [step]: true,
            },
          })),
        })),
      replaceProfileCheckups: (draftId, checkups) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            selectedCheckups: checkups,
          })),
        })),
      setCurrentDraftId: (draftId) => set({ currentDraftId: draftId }),
      setProfileCounts: (counts) =>
        set((state) => ({
          profileCounts: {
            ...state.profileCounts,
            ...counts,
          },
        })),
      setProfileHealth: (draftId, health) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            health: {
              child: {
                ...profile.health.child,
                ...health.child,
              },
              parent: {
                ...profile.health.parent,
                ...health.parent,
              },
              self: {
                ...profile.health.self,
                ...health.self,
              },
            },
          })),
        })),
      setProfileIdentity: (draftId, identity) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            ...identity,
          })),
        })),
      setProfileRecord: (draftId, checkupTypeSlug, initialPerformedAt) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            selectedCheckups: profile.selectedCheckups.map((checkup) =>
              checkup.checkupTypeSlug === checkupTypeSlug
                ? {
                    ...checkup,
                    initialPerformedAt,
                  }
                : checkup,
            ),
          })),
        })),
      setTrackingSelection: (selection) =>
        set({ trackingSelection: selection }),
    }),
    {
      name: "health-tracker-onboarding-v1",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export function getNextIncompleteProfile(profiles: ProfileDraft[]) {
  return profiles.find((profile) => !profile.completedSteps.review) ?? null;
}

export function getNextProfileAfter(
  profiles: ProfileDraft[],
  draftId: string,
): ProfileDraft | null {
  const currentIndex = profiles.findIndex(
    (profile) => profile.draftId === draftId,
  );

  if (currentIndex < 0) {
    return null;
  }

  return profiles[currentIndex + 1] ?? null;
}

export function createFinalizePayload(
  profiles: ProfileDraft[],
): FinalizeOnboardingRequest {
  const payload = {
    profiles: profiles.map(profileDraftToInput),
  };

  return finalizeOnboardingRequestSchema.parse(payload);
}

function profileDraftToInput(profile: ProfileDraft): OnboardingProfileInput {
  const base = {
    biologicalSex: profile.biologicalSex,
    birthDate: profile.birthDate ?? "",
    checkups: profile.selectedCheckups
      .filter((checkup) => checkup.enabled)
      .map((checkup) => ({
        checkupTypeSlug: checkup.checkupTypeSlug,
        frequencyDays: checkup.frequencyDays,
        initialRecord: checkup.initialPerformedAt
          ? { performedAt: checkup.initialPerformedAt }
          : undefined,
      })),
    name: profile.name ?? "",
  };

  if (profile.relationship === "SELF") {
    return {
      ...base,
      relationship: "SELF",
      healthInfo: {
        riskFactors: {
          hasFamilyHistory: profile.health.self.hasFamilyHistory,
          hasHypertension: profile.health.self.hasHypertension,
          smoker: profile.health.self.smoker,
        },
      },
    };
  }

  if (profile.relationship === "PARENT") {
    return {
      ...base,
      relationship: "PARENT",
      healthInfo: {
        concerns: {
          hasCognitiveConcerns: profile.health.parent.hasCognitiveConcerns,
          hasDiabetes: profile.health.parent.hasDiabetes,
          hasMobilityIssues: profile.health.parent.hasMobilityIssues,
        },
      },
    };
  }

  return {
    ...base,
    relationship: "CHILD",
    healthInfo: {
      concerns: {
        hasAllergies: profile.health.child.hasAllergies,
        hasAsthma: profile.health.child.hasAsthma,
      },
    },
  };
}
