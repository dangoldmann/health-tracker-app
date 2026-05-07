import { validateEnv } from './env';

describe('validateEnv', () => {
  const baseEnv = {
    DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/health',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_JWT_SECRET: 'test-secret',
  };

  it('derives the issuer when one is not provided', () => {
    const env = validateEnv(baseEnv);

    expect(env.SUPABASE_JWT_ISSUER).toBe(
      'https://example.supabase.co/auth/v1',
    );
  });

  it('fails when supabase verification config is missing', () => {
    expect(() =>
      validateEnv({
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/health',
        SUPABASE_URL: 'https://example.supabase.co',
      }),
    ).toThrow('SUPABASE_JWT_SECRET');
  });
});
