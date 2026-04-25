import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { profileIdParamSchema } from "@repo/validation";

import type { RequestWithUser } from "../auth/types/request-with-user.type";
import { AccessControlService } from "./access-control.service";

@Injectable()
export class ProfileAccessGuard implements CanActivate {
  constructor(private readonly accessControlService: AccessControlService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const params = profileIdParamSchema.parse(request.params);

    await this.accessControlService.assertCanAccessProfile(
      request.user.userId,
      params.profileId,
    );

    return true;
  }
}
