import type { GetMeResponse } from "@repo/validation";
import type { User as AppUser } from "../../generated/prisma/client";
import { UserResponseDto } from "./user-response.dto";

interface GetMeResponseInput {
  id: string;
  email?: string;
  user: AppUser | null;
}

export class GetMeResponseDto implements GetMeResponse {
  readonly id: GetMeResponse["id"];
  readonly email: GetMeResponse["email"];
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
