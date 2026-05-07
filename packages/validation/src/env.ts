import { z } from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(3001),
    API_PREFIX: z.string().trim().min(1).default('api'),
    DATABASE_URL: z.url(),
    SUPABASE_URL: z.url(),
    SUPABASE_JWT_AUDIENCE: z.string().trim().min(1).default('authenticated'),
    SUPABASE_JWT_ISSUER: z.url().optional(),
    SUPABASE_JWT_SECRET: z.string().trim().min(1).optional(),
    SUPABASE_JWKS_URL: z.url().optional(),
  })
  .superRefine((env, ctx) => {
    if (!env.SUPABASE_JWT_SECRET && !env.SUPABASE_JWKS_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['SUPABASE_JWT_SECRET'],
        message:
          'Either SUPABASE_JWT_SECRET or SUPABASE_JWKS_URL must be provided.',
      });
    }
  });

export type AppEnv = z.infer<typeof envSchema>;
