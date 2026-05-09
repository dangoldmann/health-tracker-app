import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  authTokenClaimsSchema,
  type RuntimeAppEnv,
} from "@repo/validation";
import { createPublicKey, type JsonWebKey } from "node:crypto";
import type { JwtHeader, JwtPayload, SigningKeyCallback } from "jsonwebtoken";
import { verify } from "jsonwebtoken";

import type { AuthenticatedUser } from "./interfaces/authenticated-user.interface";

interface JwksResponse {
  keys: Array<JsonWebKey & { kid?: string }>;
}

@Injectable()
export class AuthService {
  private readonly audience: string;
  private readonly issuer: string;
  private readonly jwksUrl: string;
  private readonly publicKeyCache = new Map<string, string>();

  constructor(
    @Inject(ConfigService)
    configService: ConfigService<RuntimeAppEnv, true>,
  ) {
    const supabaseUrl = configService.getOrThrow("SUPABASE_URL", {
      infer: true,
    });
    const issuer =
      configService.get("SUPABASE_JWT_ISSUER", {
        infer: true,
      }) ?? new URL("auth/v1", `${supabaseUrl}/`).toString().replace(/\/$/, "");
    const jwksUrl = configService.getOrThrow("SUPABASE_JWKS_URL", {
      infer: true,
    });

    this.audience = configService.getOrThrow("SUPABASE_JWT_AUDIENCE", {
      infer: true,
    });
    this.issuer = issuer;
    this.jwksUrl = jwksUrl;
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUser> {
    let payload: JwtPayload | string;

    try {
      payload = await new Promise<JwtPayload | string>((resolve, reject) => {
        verify(token, this.getSigningKey, {
          algorithms: ["RS256"],
          audience: this.audience,
          issuer: this.issuer,
        }, (error, decoded) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(decoded ?? "");
        });
      });
    } catch {
      throw new UnauthorizedException("Invalid access token.");
    }

    if (typeof payload === "string") {
      throw new UnauthorizedException("Invalid access token claims.");
    }

    const claims = authTokenClaimsSchema.safeParse({
      ...payload,
      sub: payload.sub,
    });

    if (!claims.success) {
      throw new UnauthorizedException("Invalid access token claims.");
    }

    return {
      id: claims.data.sub,
      email: claims.data.email,
      claims: claims.data,
    };
  }

  private readonly getSigningKey = (
    header: JwtHeader,
    callback: SigningKeyCallback,
  ): void => {
    if (!header.kid) {
      callback(new Error("Missing signing key identifier."));
      return;
    }

    void this.fetchSigningKey(header.kid)
      .then((signingKey) => {
        callback(null, signingKey);
      })
      .catch((error: unknown) => {
        callback(error as Error);
      });
  };

  private async fetchSigningKey(kid: string): Promise<string> {
    const cachedKey = this.publicKeyCache.get(kid);

    if (cachedKey) {
      return cachedKey;
    }

    const response = await fetch(this.jwksUrl);

    if (!response.ok) {
      throw new Error("Unable to fetch JWKS.");
    }

    const body = (await response.json()) as JwksResponse;
    const jwk = body.keys.find((key) => key.kid === kid);

    if (!jwk) {
      throw new Error("Signing key not found.");
    }

    const publicKey = createPublicKey({
      key: jwk,
      format: "jwk",
    })
      .export({
        type: "spki",
        format: "pem",
      })
      .toString();

    this.publicKeyCache.set(kid, publicKey);

    return publicKey;
  }
}
