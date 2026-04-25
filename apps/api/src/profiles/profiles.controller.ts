import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateProfileInput, createProfileSchema } from "@repo/validation";

import type { ActiveUser } from "../auth/types/active-user.type";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import { ProfilesService } from "./profiles.service";

@Controller("profiles")
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  list(@CurrentUser() activeUser: ActiveUser) {
    return this.profilesService.listForUser(activeUser.userId);
  }

  @Post()
  create(
    @CurrentUser() activeUser: ActiveUser,
    @Body(new ZodValidationPipe(createProfileSchema)) body: CreateProfileInput,
  ) {
    return this.profilesService.createForUser(activeUser.userId, body);
  }
}
