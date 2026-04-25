import { z } from "zod";

export const devicePlatformSchema = z.enum(["ios", "android", "web"]);

export const updateDeviceTokenSchema = z.object({
  pushToken: z.string().min(1),
  platform: devicePlatformSchema,
  timezone: z.string().min(1).max(100).optional(),
});

export type UpdateDeviceTokenInput = z.infer<typeof updateDeviceTokenSchema>;
