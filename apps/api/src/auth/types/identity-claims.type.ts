export interface IdentityClaims {
  subject: string;
  email: string;
  provider: string;
  claims: Record<string, unknown>;
}
