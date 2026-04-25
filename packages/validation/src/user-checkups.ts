import { z } from "zod";

export const bulkUpsertUserCheckupsSchema = z.object({
  checkups: z
    .array(
      z.object({
        profileId: z.string().uuid(),
        type: z.string().min(1),
        frequencyDays: z.coerce.number().int().positive(),
        lastPerformed: z.string().date().optional(),
      }),
    )
    .min(1),
});

export type BulkUpsertUserCheckupsInput = z.infer<
  typeof bulkUpsertUserCheckupsSchema
>;
