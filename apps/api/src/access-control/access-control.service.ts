import { ForbiddenException, Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AccessControlService {
  constructor(private readonly prisma: PrismaService) {}

  async canAccessProfile(userId: string, profileId: string): Promise<boolean> {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
        OR: [
          { ownerId: userId },
          {
            familyGroup: {
              members: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    return Boolean(profile);
  }

  async assertCanAccessProfile(userId: string, profileId: string) {
    const allowed = await this.canAccessProfile(userId, profileId);

    if (!allowed) {
      throw new ForbiddenException(
        "You do not have access to the requested profile.",
      );
    }
  }

  async assertCanAccessProfiles(userId: string, profileIds: string[]) {
    const uniqueIds = [...new Set(profileIds)];

    for (const profileId of uniqueIds) {
      await this.assertCanAccessProfile(userId, profileId);
    }
  }
}
