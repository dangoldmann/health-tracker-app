import { envSchema, type AppEnv } from '@repo/validation';

function deriveIssuer(supabaseUrl: string) {
  const normalized = supabaseUrl.endsWith('/')
    ? supabaseUrl
    : `${supabaseUrl}/`;

  return new URL('auth/v1', normalized).toString().replace(/\/$/, '');
}

function formatIssues(issues: string[]) {
  return issues.map((issue) => `- ${issue}`).join('\n');
}

export function validateEnv(config: Record<string, unknown>): AppEnv {
  const parsed = envSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment configuration:\n${formatIssues(
        parsed.error.issues.map((issue) => {
          const path = issue.path.join('.') || 'root';
          return `${path}: ${issue.message}`;
        }),
      )}`,
    );
  }

  return {
    ...parsed.data,
    SUPABASE_JWT_ISSUER:
      parsed.data.SUPABASE_JWT_ISSUER ?? deriveIssuer(parsed.data.SUPABASE_URL),
  };
}
