import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { AppEnv } from '@repo/validation';
import jwt from 'jsonwebtoken';
import { SupabaseTokenVerifierService } from './supabase-token-verifier.service';

type MockConfigService = Pick<ConfigService<AppEnv, true>, 'get'>;

describe('SupabaseTokenVerifierService', () => {
  const issuer = 'https://example.supabase.co/auth/v1';
  const audience = 'authenticated';
  const secret = 'super-secret';

  function createConfigService(
    overrides: Partial<AppEnv> = {},
  ): MockConfigService {
    const env: AppEnv = {
      API_PREFIX: 'api',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/health',
      NODE_ENV: 'test',
      PORT: 3001,
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_JWT_AUDIENCE: audience,
      SUPABASE_JWT_ISSUER: issuer,
      SUPABASE_JWT_SECRET: secret,
      ...overrides,
    };

    return {
      get(key: keyof AppEnv) {
        return env[key];
      },
    } as MockConfigService;
  }

  async function signToken(tokenSecret = secret) {
    return jwt.sign(
      { email: 'test@example.com', role: 'authenticated' },
      tokenSecret,
      {
        algorithm: 'HS256',
        audience,
        expiresIn: '10m',
        issuer,
        subject: 'auth-user-123',
      },
    );
  }

  it('verifies a valid supabase token', async () => {
    const service = new SupabaseTokenVerifierService(
      createConfigService() as ConfigService<AppEnv, true>,
    );

    const token = await signToken();
    const claims = await service.verify(token);

    expect(claims.sub).toBe('auth-user-123');
    expect(claims.email).toBe('test@example.com');
  });

  it('rejects a token signed with the wrong secret', async () => {
    const service = new SupabaseTokenVerifierService(
      createConfigService() as ConfigService<AppEnv, true>,
    );

    const token = await signToken('wrong-secret');

    await expect(service.verify(token)).rejects.toThrow(UnauthorizedException);
  });

  it('rejects a malformed token', async () => {
    const service = new SupabaseTokenVerifierService(
      createConfigService() as ConfigService<AppEnv, true>,
    );

    await expect(service.verify('not-a-jwt')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
