import type { InternalUserIdentity } from './auth.types';

export abstract class IdentityService {
  abstract findByExternalAuthId(
    externalAuthId: string,
  ): Promise<InternalUserIdentity | null>;
}
