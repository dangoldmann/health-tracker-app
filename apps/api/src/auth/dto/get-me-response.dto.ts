import type { User as AppUser } from "../../generated/prisma/client";
import { UserResponseDto } from "./user-response.dto";

interface GetMeResponseInput {
  id: string;
  email?: string;
  user: AppUser | null;
}

export class GetMeResponseDto {
  readonly id: string;
  readonly email: string | null;
  readonly user: UserResponseDto | null;

  private constructor(input: GetMeResponseInput) {
    this.id = input.id;
    this.email = input.email ?? null;
    this.user = input.user ? UserResponseDto.from(input.user) : null;
  }

  static from(input: GetMeResponseInput): GetMeResponseDto {
    return new GetMeResponseDto(input);
  }
}
