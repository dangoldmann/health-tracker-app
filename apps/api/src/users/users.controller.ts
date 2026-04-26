import { Body, Controller, Patch } from "@nestjs/common";
import {
  UpdateDeviceTokenInput,
  UpdateOnboardingStatusInput,
  updateDeviceTokenSchema,
  updateOnboardingStatusSchema,
} from "@repo/validation";

import type { ActiveUser } from "../auth/types/active-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch("device-token")
  updateDeviceToken(
    @CurrentUser() activeUser: ActiveUser,
    @Body(new ZodValidationPipe(updateDeviceTokenSchema))
    body: UpdateDeviceTokenInput,
  ) {
    return this.usersService.upsertDeviceToken(activeUser.userId, body);
  }

  @Patch("onboarding-status")
  updateOnboardingStatus(
    @CurrentUser() activeUser: ActiveUser,
    @Body(new ZodValidationPipe(updateOnboardingStatusSchema))
    body: UpdateOnboardingStatusInput,
  ) {
    return this.usersService.updateOnboardingStatus(activeUser.userId, body);
  }
}
