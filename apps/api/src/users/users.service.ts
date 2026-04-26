import { Injectable } from "@nestjs/common";
import { DevicePlatform } from "../generated/prisma/client";
import {
  UpdateDeviceTokenInput,
  UpdateOnboardingStatusInput,
} from "@repo/validation";

import { PrismaService } from "../prisma/prisma.service";
import {
  toOnboardingStatusResponse,
} from "./user-state.presenter";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertDeviceToken(userId: string, input: UpdateDeviceTokenInput) {
    return this.prisma.deviceToken.upsert({
      where: {
        pushToken: input.pushToken,
      },
      update: {
        userId,
        platform: input.platform as DevicePlatform,
        timezone: input.timezone,
        lastSeenAt: new Date(),
      },
      create: {
        userId,
        pushToken: input.pushToken,
        platform: input.platform as DevicePlatform,
        timezone: input.timezone,
        lastSeenAt: new Date(),
      },
    });
  }

  async updateOnboardingStatus(
    userId: string,
    input: UpdateOnboardingStatusInput,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        onboardingCompletedAt: input.completed ? new Date() : null,
      },
      select: {
        onboardingCompletedAt: true,
      },
    });

    return toOnboardingStatusResponse(user);
  }
}
