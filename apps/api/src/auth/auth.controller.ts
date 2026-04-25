import { Body, Controller, Get, Post } from "@nestjs/common";
import { RegisterUserInput, registerUserSchema } from "@repo/validation";

import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import type { ActiveUser } from "./types/active-user.type";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @CurrentUser() activeUser: ActiveUser,
    @Body(new ZodValidationPipe(registerUserSchema)) body: RegisterUserInput,
  ) {
    return this.authService.registerCurrentUser(activeUser, body);
  }

  @Get("me")
  me(@CurrentUser() activeUser: ActiveUser) {
    return activeUser;
  }
}
