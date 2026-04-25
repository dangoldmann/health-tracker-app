import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createRemoteJWKSet, jwtVerify } from "jose";

import type { Environment } from "../config/environment";
import type { IdentityClaims } from "./types/identity-claims.type";

@Injectable()
export class IdentityService {
  constructor(private readonly configService: ConfigService<Environment, true>) {}

  async verifyAccessToken(token: string): Promise<IdentityClaims> {
    try {
      const jwks = createRemoteJWKSet(
        new URL(this.configService.getOrThrow("AUTH_JWKS_URL")),
      );

      const { payload } = await jwtVerify(token, jwks, {
        issuer: this.configService.getOrThrow("AUTH_ISSUER"),
        audience: this.configService.get("AUTH_AUDIENCE") || undefined,
      });

      const subject = payload.sub;
      const email = payload.email;

      if (!subject || typeof email !== "string") {
        throw new UnauthorizedException("Token is missing required identity claims.");
      }

      return {
        subject,
        email,
        provider: this.configService.getOrThrow("AUTH_PROVIDER_NAME"),
        claims: payload as Record<string, unknown>,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException("Unable to verify access token.");
    }
  }
}
