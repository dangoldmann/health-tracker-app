import { z } from "zod";

const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  API_PREFIX: z.string().trim().min(1).default("api"),
  DATABASE_URL: z.url(),
  SUPABASE_URL: z.url(),
  SUPABASE_JWT_AUDIENCE: z.string().trim().min(1).default("authenticated"),
  SUPABASE_JWT_ISSUER: z.url().optional(),
  SUPABASE_JWKS_URL: z.url(),
});

export const runtimeEnvSchema = baseEnvSchema;

export const envSchema = baseEnvSchema.extend({
  DIRECT_URL: z.url(),
});

export type AppEnv = z.infer<typeof envSchema>;
export type RuntimeAppEnv = z.infer<typeof runtimeEnvSchema>;
