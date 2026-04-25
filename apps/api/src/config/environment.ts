import { z } from "zod";

const truthyValues = new Set(["1", "true", "yes"]);

const coerceBoolean = (value: unknown) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return truthyValues.has(value.toLowerCase());
  }

  return false;
};

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  AUTH_PROVIDER_NAME: z.string().min(1).default("supabase"),
  AUTH_ISSUER: z.string().url(),
  AUTH_JWKS_URL: z.string().url(),
  AUTH_AUDIENCE: z.string().min(1).optional(),
  // STORAGE_REGION: z.string().min(1).default("us-east-1"),
  // STORAGE_BUCKET: z.string().min(1),
  // STORAGE_ENDPOINT: z.string().url().optional(),
  // STORAGE_ACCESS_KEY_ID: z.string().min(1),
  // STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  // STORAGE_FORCE_PATH_STYLE: z.preprocess(coerceBoolean, z.boolean()).default(
  //   true,
  // ),
  APP_ORIGIN: z.string().url().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export const validateEnvironment = (
  config: Record<string, unknown>,
): Environment => environmentSchema.parse(config);
