import type { AuthTokenClaims } from "@repo/validation";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  claims: AuthTokenClaims;
}
