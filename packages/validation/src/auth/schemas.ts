import { z } from "zod";

export const authTokenClaimsSchema = z.object({
  sub: z.string().trim().min(1),
  aud: z.union([z.string(), z.array(z.string())]).optional(),
  iss: z.string().trim().min(1).optional(),
  email: z.email().optional(),
  role: z.string().trim().min(1).optional(),
  exp: z.number().int().optional(),
  iat: z.number().int().optional(),
  app_metadata: z.record(z.string(), z.unknown()).optional(),
  user_metadata: z.record(z.string(), z.unknown()).optional(),
});

export const appUserResponseSchema = z.object({
  id: z.string().trim().min(1),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const getMeResponseSchema = z.object({
  id: z.string().trim().min(1),
  email: z.email().nullable(),
  user: appUserResponseSchema.nullable(),
});
