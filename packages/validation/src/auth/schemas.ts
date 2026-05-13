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
