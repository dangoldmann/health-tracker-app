import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authTokenClaimsSchema, type AppEnv } from '@repo/validation';
import jwt, { type JwtHeader, type JwtPayload } from 'jsonwebtoken';

@Injectable()
export class SupabaseTokenVerifierService {
  constructor(private readonly configService: ConfigService<AppEnv, true>) {}

  async verify(token: string) {
    try {
      const payload = await this.verifyJwt(token);
      return authTokenClaimsSchema.parse(payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid Supabase access token.', {
        cause: error,
      });
    }
  }

  private async verifyJwt(token: string): Promise<JwtPayload> {
    const secret = this.configService.get('SUPABASE_JWT_SECRET', {
      infer: true,
    });
    const audience = this.configService.get('SUPABASE_JWT_AUDIENCE', {
      infer: true,
    });
    const issuer = this.configService.get('SUPABASE_JWT_ISSUER', {
      infer: true,
    });

    if (secret) {
      const payload = jwt.verify(token, secret, {
        audience,
        issuer,
      });

      if (typeof payload === 'string') {
        throw new UnauthorizedException('Invalid Supabase access token.');
      }

      return payload;
    }

    const jwksUrl = this.configService.get('SUPABASE_JWKS_URL', {
      infer: true,
    });

    if (!jwksUrl) {
      throw new UnauthorizedException(
        'Supabase JWT verification is not configured.',
      );
    }

    const { default: jwksClient } = await import('jwks-rsa');
    const client = jwksClient({
      cache: true,
      jwksUri: jwksUrl,
    });

    return new Promise<JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        (header: JwtHeader, callback) => {
          const keyId = header.kid;

          if (!keyId) {
            callback(new Error('Missing key id in JWT header.'));
            return;
          }

          client
            .getSigningKey(keyId)
            .then((key) => callback(null, key.getPublicKey()))
            .catch((error) => callback(error));
        },
        { audience, issuer },
        (error, decoded) => {
          if (error) {
            reject(error);
            return;
          }

          if (!decoded || typeof decoded === 'string') {
            reject(new Error('Supabase token payload is not an object.'));
            return;
          }

          resolve(decoded);
        },
      );
    });
  }
}
