export const trackingIntentLabels = {
  children: "My Children",
  parents: "My Parents / Seniors",
  self: "Myself",
} as const;

export type TrackingIntent = keyof typeof trackingIntentLabels;

export interface QueueItem {
  id: string;
  kind: "child" | "parent" | "self";
  label: string;
}

export const onboardingFlowSteps = [
  {
    description:
      "Social or email auth tied to timezone capture and backend registration.",
    title: "1. Welcome & authentication",
  },
  {
    description:
      "Intent selection seeds the queue and routes the user into the correct profile branches.",
    title: "2. Intent selector",
  },
  {
    description:
      "Profiles collect age, sex, risk factors, insurance, and family-specific concerns.",
    title: "3. Profile creation branches",
  },
  {
    description:
      "Suggested checkups are fetched, reviewed, and overridden before first launch completes.",
    title: "4. Recommendations review",
  },
  {
    description:
      "Push token registration closes the loop for overdue and anticipatory reminders.",
    title: "5. Notification opt-in",
  },
];
