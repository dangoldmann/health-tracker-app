export const frequencyOptions = [
  { frequencyDays: 30, label: "1 month" },
  { frequencyDays: 60, label: "2 months" },
  { frequencyDays: 90, label: "3 months" },
  { frequencyDays: 120, label: "4 months" },
  { frequencyDays: 150, label: "5 months" },
  { frequencyDays: 180, label: "6 months" },
  { frequencyDays: 270, label: "9 months" },
  { frequencyDays: 365, label: "1 year" },
  { frequencyDays: 548, label: "1.5 years" },
  { frequencyDays: 730, label: "2 years" },
  { frequencyDays: 1095, label: "3 years" },
] as const;

export function getFrequencyOptionIndex(frequencyDays: number) {
  const exactIndex = frequencyOptions.findIndex(
    (option) => option.frequencyDays === frequencyDays,
  );

  if (exactIndex >= 0) {
    return exactIndex;
  }

  return frequencyOptions.reduce((closestIndex, option, index) => {
    const closestDistance = Math.abs(
      frequencyOptions[closestIndex].frequencyDays - frequencyDays,
    );
    const optionDistance = Math.abs(option.frequencyDays - frequencyDays);
    return optionDistance < closestDistance ? index : closestIndex;
  }, 0);
}

export function formatFrequencyLabel(frequencyDays: number) {
  const option = frequencyOptions[getFrequencyOptionIndex(frequencyDays)];
  return `Every ${option.label}`;
}
