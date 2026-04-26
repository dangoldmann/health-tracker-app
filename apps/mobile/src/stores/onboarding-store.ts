import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import {
  type QueueItem,
  type TrackingIntent,
} from "@/features/onboarding/structure";

const minimumRelativeCount = 1;
const onboardingStorageKey = "healthguard-onboarding";

interface OnboardingState {
  childrenCount: number;
  hydrate: () => Promise<void>;
  parentsCount: number;
  queue: QueueItem[];
  reset: () => void;
  selectedIntents: TrackingIntent[];
  setRelativeCount: (intent: "children" | "parents", count: number) => void;
  toggleIntent: (intent: TrackingIntent) => void;
}

const defaultState = {
  childrenCount: 1,
  parentsCount: 1,
  selectedIntents: ["self"] as TrackingIntent[],
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...defaultState,
  hydrate: async () => {
    const storedSnapshot = await AsyncStorage.getItem(onboardingStorageKey);

    if (!storedSnapshot) {
      return;
    }

    const parsedSnapshot = JSON.parse(storedSnapshot) as Partial<PersistedSnapshot>;
    const childrenCount = normalizeRelativeCount(parsedSnapshot.childrenCount);
    const parentsCount = normalizeRelativeCount(parsedSnapshot.parentsCount);
    const selectedIntents =
      parsedSnapshot.selectedIntents && parsedSnapshot.selectedIntents.length > 0
        ? parsedSnapshot.selectedIntents
        : defaultState.selectedIntents;

    set({
      childrenCount,
      parentsCount,
      queue: buildQueue(selectedIntents, childrenCount, parentsCount),
      selectedIntents,
    });
  },
  queue: buildQueue(defaultState.selectedIntents, 1, 1),
  reset: () => {
    const nextState = {
      ...defaultState,
      queue: buildQueue(defaultState.selectedIntents, 1, 1),
    };

    void persistSnapshot(nextState);
    set(nextState);
  },
  setRelativeCount: (intent, rawCount) =>
    set((state) => {
      const nextCount = normalizeRelativeCount(rawCount);
      const childrenCount =
        intent === "children" ? nextCount : state.childrenCount;
      const parentsCount =
        intent === "parents" ? nextCount : state.parentsCount;

      const nextState = {
        childrenCount,
        parentsCount,
        queue: buildQueue(state.selectedIntents, childrenCount, parentsCount),
      };

      void persistSnapshot({
        childrenCount: nextState.childrenCount,
        parentsCount: nextState.parentsCount,
        selectedIntents: state.selectedIntents,
      });

      return nextState;
    }),
  toggleIntent: (intent) =>
    set((state) => {
      const nextIntents: TrackingIntent[] = state.selectedIntents.includes(intent)
        ? state.selectedIntents.filter((item) => item !== intent)
        : [...state.selectedIntents, intent];

      const selectedIntents: TrackingIntent[] =
        nextIntents.length > 0 ? nextIntents : ["self"];

      const nextState = {
        queue: buildQueue(
          selectedIntents,
          state.childrenCount,
          state.parentsCount,
        ),
        selectedIntents,
      };

      void persistSnapshot({
        childrenCount: state.childrenCount,
        parentsCount: state.parentsCount,
        selectedIntents,
      });

      return nextState;
    }),
}));

interface PersistedSnapshot {
  childrenCount: number;
  parentsCount: number;
  selectedIntents: TrackingIntent[];
}

function buildQueue(
  selectedIntents: TrackingIntent[],
  childrenCount: number,
  parentsCount: number,
): QueueItem[] {
  const queue: QueueItem[] = [];

  if (selectedIntents.includes("self")) {
    queue.push({ id: "self-1", kind: "self", label: "My profile" });
  }

  if (selectedIntents.includes("children")) {
    for (let index = 0; index < childrenCount; index += 1) {
      queue.push({
        id: `child-${index + 1}`,
        kind: "child",
        label: `Child ${index + 1}`,
      });
    }
  }

  if (selectedIntents.includes("parents")) {
    for (let index = 0; index < parentsCount; index += 1) {
      queue.push({
        id: `parent-${index + 1}`,
        kind: "parent",
        label: `Parent ${index + 1}`,
      });
    }
  }

  return queue;
}

function normalizeRelativeCount(value: number | undefined) {
  return Math.max(minimumRelativeCount, value ?? minimumRelativeCount);
}

async function persistSnapshot(snapshot: PersistedSnapshot) {
  await AsyncStorage.setItem(onboardingStorageKey, JSON.stringify(snapshot));
}
