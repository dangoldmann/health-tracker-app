import { z } from "zod";

const profileIdsInputSchema = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
}, z.array(z.string().uuid()).min(1));

export const generateSuggestionsQuerySchema = z.object({
  profileIds: profileIdsInputSchema,
});

export type GenerateSuggestionsQuery = z.infer<
  typeof generateSuggestionsQuerySchema
>;
