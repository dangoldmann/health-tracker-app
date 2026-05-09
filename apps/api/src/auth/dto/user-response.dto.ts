import type { User as AppUser } from "../../generated/prisma/client";

export class UserResponseDto {
  readonly id: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  private constructor(user: AppUser) {
    this.id = user.id;
    this.createdAt = user.createdAt.toISOString();
    this.updatedAt = user.updatedAt.toISOString();
  }

  static from(user: AppUser): UserResponseDto {
    return new UserResponseDto(user);
  }
}
