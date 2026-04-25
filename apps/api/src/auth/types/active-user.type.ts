export interface ActiveUser {
  userId: string;
  email: string;
  externalAuthId: string;
  provider: string;
  claims: Record<string, unknown>;
}
