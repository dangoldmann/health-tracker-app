import type { AppUserResponse } from "@repo/validation";
import type { User as AppUser } from "../../generated/prisma/client";

export class UserResponseDto implements AppUserResponse {
  readonly id: AppUserResponse["id"];
  readonly createdAt: AppUserResponse["createdAt"];
  readonly updatedAt: AppUserResponse["updatedAt"];

  private constructor(user: AppUser) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
  }

  static from(user: AppUser): UserResponseDto {
    return new UserResponseDto(user);
  }
}
