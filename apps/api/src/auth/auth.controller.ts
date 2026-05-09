import { Controller, Get, UseGuards } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { User } from "./decorators/user.decorator";
import { AuthGuard } from "./guards/auth.guard";
import { GetMeResponseDto } from "./dto/get-me-response.dto";
import type { AuthenticatedUser } from "./interfaces/authenticated-user.interface";

@Controller("auth")
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe(
    @User() authenticatedUser: AuthenticatedUser,
  ): Promise<GetMeResponseDto> {
    const user = await this.usersService.findById(authenticatedUser.id);

    return GetMeResponseDto.from({
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      user,
    });
  }
}
