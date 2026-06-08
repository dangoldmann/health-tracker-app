import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  finalizeOnboardingRequestSchema,
  MAX_CHILD_PROFILES,
  MAX_PARENT_PROFILES,
  MAX_SELF_PROFILES,
  type BiologicalSex,
  type CheckupTypeSlug,
  type FinalizeOnboardingRequest,
  type OnboardingProfileInput,
  type ProfileRelationship,
} from "@repo/validation";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  RecordRecencyBucket,
  type RecordRecencyBucket as RecordRecencyBucketValue,
} from "./records";

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
  frequencyDays: number;
  initialRecord?:
    | {
        bucket: RecordRecencyBucketValue;
        source: "bucket";
      }
    | {
        performedAt: string;
        source: "exact";
      };
  source: "added" | "recommended";
};

export type ProfileDraft = {
  biologicalSex: BiologicalSex;
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

type ProfileStep = keyof ProfileDraft["completedSteps"];
export type EditableProfileStep = Exclude<ProfileStep, 'review'>

type OnboardingState = {
  currentDraftId: string | null;
  profiles: ProfileDraft[];
  trackingSelection: TrackingSelection;
  addProfile: (relationship: ProfileRelationship) => string | null;
  buildQueue: () => string | null;
  canAddProfile: (relationship: ProfileRelationship) => boolean;
  clearDraft: () => void;
  completeProfileStep: (draftId: string, step: ProfileStep) => void;
  replaceProfileCheckups: (
    draftId: string,
    checkups: ProfileCheckupDraft[],
  ) => void;
  setCurrentDraftId: (draftId: string | null) => void;
  setProfileHealth: (
    draftId: string,
    health: Partial<ProfileHealthDraft>,
  ) => void;
  setProfileIdentity: (
    draftId: string,
    identity: Partial<{
      biologicalSex: BiologicalSex;
      birthDate: string;
      name: string;
    }>,
  ) => void;
  setProfileRecord: (
    draftId: string,
    checkupTypeSlug: CheckupTypeSlug,
    initialRecord?: ProfileCheckupDraft["initialRecord"],
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
  profiles: [],
  trackingSelection: {
    child: false,
    parent: false,
    self: true,
  },
};

function createProfileDraft(
  draftId: string,
  relationship: ProfileRelationship,
  label: string,
): ProfileDraft {
  return {
    biologicalSex: "FEMALE",
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
      addProfile: (relationship) => {
        const { profiles } = get();
        const sameRelationship = profiles.filter(
          (profile) => profile.relationship === relationship,
        );
        const max =
          relationship === "SELF"
            ? MAX_SELF_PROFILES
            : relationship === "CHILD"
              ? MAX_CHILD_PROFILES
              : MAX_PARENT_PROFILES;

        if (sameRelationship.length >= max) {
          return null;
        }

        const nextIndex = sameRelationship.length + 1;
        const prefix = relationship.toLocaleLowerCase();
        const draftId = `${prefix}-${nextIndex}`;
        const label =
          relationship === "SELF"
            ? "Myself"
            : `${prefix === "child" ? "Child" : "Parent"} ${nextIndex}`;
        const newProfile = createProfileDraft(draftId, relationship, label);

        set({ profiles: [...profiles, newProfile] });
        return draftId;
      },
      canAddProfile: (relationship) => {
        const sameRelationship = get().profiles.filter(
          (profile) => profile.relationship === relationship,
        );
        const max =
          relationship === "SELF"
            ? MAX_SELF_PROFILES
            : relationship === "CHILD"
              ? MAX_CHILD_PROFILES
              : MAX_PARENT_PROFILES;
        return sameRelationship.length < max;
      },
      buildQueue: () => {
        const { profiles: existing, trackingSelection } = get();

        const keepRelationship = (relationship: ProfileRelationship) =>
          relationship === "SELF"
            ? trackingSelection.self
            : relationship === "CHILD"
              ? trackingSelection.child
              : trackingSelection.parent;

        const kept = existing.filter((profile) =>
          keepRelationship(profile.relationship),
        );

        const seed = (
          relationship: ProfileRelationship,
          draftId: string,
          label: string,
        ) => {
          if (!keepRelationship(relationship)) return null;
          if (kept.some((profile) => profile.relationship === relationship)) {
            return null;
          }
          return createProfileDraft(draftId, relationship, label);
        };

        const seeded = [
          seed("SELF", "self-1", "Myself"),
          seed("CHILD", "child-1", "Child 1"),
          seed("PARENT", "parent-1", "Parent 1"),
        ].filter((profile): profile is ProfileDraft => profile !== null);

        const merged = [...kept, ...seeded];
        const order: Record<ProfileRelationship, number> = {
          SELF: 0,
          CHILD: 1,
          PARENT: 2,
        };
        merged.sort((a, b) => {
          const byRelationship = order[a.relationship] - order[b.relationship];
          if (byRelationship !== 0) return byRelationship;
          return a.draftId.localeCompare(b.draftId);
        });

        const firstDraftId = merged[0]?.draftId ?? null;
        set({
          currentDraftId: firstDraftId,
          profiles: merged,
        });
        return firstDraftId;
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
      setProfileRecord: (draftId, checkupTypeSlug, initialRecord) =>
        set((state) => ({
          profiles: updateProfile(state.profiles, draftId, (profile) => ({
            ...profile,
            selectedCheckups: profile.selectedCheckups.map((checkup) =>
              checkup.checkupTypeSlug === checkupTypeSlug
                ? {
                    ...checkup,
                    initialRecord,
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
    checkups: profile.selectedCheckups.map((checkup) => ({
      checkupTypeSlug: checkup.checkupTypeSlug,
      frequencyDays: checkup.frequencyDays,
      initialRecord: getInitialRecordInput(checkup),
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

function getInitialRecordInput(
  checkup: ProfileCheckupDraft,
): { performedAt: string } | undefined {
  if (!checkup.initialRecord) {
    return undefined;
  }

  if (checkup.initialRecord.source === "exact") {
    return { performedAt: checkup.initialRecord.performedAt };
  }

  return getBucketPerformedAt(checkup.initialRecord.bucket);
}

function getBucketPerformedAt(
  bucket: RecordRecencyBucketValue,
): { performedAt: string } | undefined {
  const currentYear = new Date().getFullYear();

  if (bucket === RecordRecencyBucket.ThisYear) {
    return { performedAt: `${currentYear}-01-01` };
  }

  if (bucket === RecordRecencyBucket.LastYear) {
    return { performedAt: `${currentYear - 1}-01-01` };
  }

  if (bucket === RecordRecencyBucket.Earlier) {
    return { performedAt: `${currentYear - 2}-01-01` };
  }

  return undefined;
}
