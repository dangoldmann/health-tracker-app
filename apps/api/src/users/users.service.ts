import { Injectable } from "@nestjs/common";
import { DevicePlatform } from "@prisma/client";
import { UpdateDeviceTokenInput } from "@repo/validation";

import { PrismaService } from "../prisma/prisma.service";

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
}
