import {
  MAX_SELF_PROFILES,
  MAX_CHILD_PROFILES,
  MAX_PARENT_PROFILES,
} from "./constants";
import { BuildOnboardingQueueInput, OnboardingQueueEntry } from "./types";

export function buildOnboardingQueue({
  includeSelf,
  childCount,
  parentCount,
}: BuildOnboardingQueueInput): OnboardingQueueEntry[] {
  if (includeSelf && MAX_SELF_PROFILES < 1) {
    throw new Error("SELF profiles are not supported.");
  }

  if (childCount < 0 || childCount > MAX_CHILD_PROFILES) {
    throw new Error(`Child count must be between 0 and ${MAX_CHILD_PROFILES}.`);
  }

  if (parentCount < 0 || parentCount > MAX_PARENT_PROFILES) {
    throw new Error(
      `Parent count must be between 0 and ${MAX_PARENT_PROFILES}.`,
    );
  }

  const queue: OnboardingQueueEntry[] = [];

  if (includeSelf) {
    queue.push({
      draftId: "self-1",
      label: "Myself",
      relationship: "SELF",
    });
  }

  for (let index = 0; index < childCount; index += 1) {
    queue.push({
      draftId: `child-${index + 1}`,
      label: `Child ${index + 1}`,
      relationship: "CHILD",
    });
  }

  for (let index = 0; index < parentCount; index += 1) {
    queue.push({
      draftId: `parent-${index + 1}`,
      label: `Parent ${index + 1}`,
      relationship: "PARENT",
    });
  }

  return queue;
}
