export const RecordRecencyBucket = {
  DontRemember: "dont-remember",
  Earlier: "earlier",
  LastYear: "last-year",
  ThisYear: "this-year",
} as const;

export const recordRecencyBuckets = [
  RecordRecencyBucket.ThisYear,
  RecordRecencyBucket.LastYear,
  RecordRecencyBucket.Earlier,
  RecordRecencyBucket.DontRemember,
] as const;

export type RecordRecencyBucket = (typeof recordRecencyBuckets)[number];

export const recordRecencyBucketOptions: {
  label: string;
  value: RecordRecencyBucket;
}[] = [
  { label: "This year", value: RecordRecencyBucket.ThisYear },
  { label: "Last year", value: RecordRecencyBucket.LastYear },
  { label: "Earlier", value: RecordRecencyBucket.Earlier },
  { label: "Don't recall", value: RecordRecencyBucket.DontRemember },
];
