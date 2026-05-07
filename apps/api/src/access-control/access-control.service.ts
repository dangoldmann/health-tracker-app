import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AccessControlService {
  async assertProfileAccess() {
    throw new NotImplementedException(
      'Profile-level access control has not been implemented yet.',
    );
  }
}
