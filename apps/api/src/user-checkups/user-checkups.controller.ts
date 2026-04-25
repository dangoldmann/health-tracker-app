import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  BulkUpsertUserCheckupsInput,
  bulkUpsertUserCheckupsSchema,
  profileIdParamSchema,
} from "@repo/validation";

import { ProfileAccessGuard } from "../access-control/profile-access.guard";
import type { ActiveUser } from "../auth/types/active-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { UserCheckupsService } from "./user-checkups.service";

@Controller()
export class UserCheckupsController {
  constructor(private readonly userCheckupsService: UserCheckupsService) {}

  @Post("user-checkups/bulk")
  bulkUpsert(
    @CurrentUser() activeUser: ActiveUser,
    @Body(new ZodValidationPipe(bulkUpsertUserCheckupsSchema))
    body: BulkUpsertUserCheckupsInput,
  ) {
    return this.userCheckupsService.bulkUpsert(activeUser.userId, body);
  }

  @Get("profiles/:profileId/checkups")
  @UseGuards(ProfileAccessGuard)
  listByProfile(
    @CurrentUser() activeUser: ActiveUser,
    @Param(new ZodValidationPipe(profileIdParamSchema))
    params: { profileId: string },
  ) {
    return this.userCheckupsService.listByProfile(
      activeUser.userId,
      params.profileId,
    );
  }
}
