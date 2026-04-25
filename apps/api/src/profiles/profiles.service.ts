import { ForbiddenException, Injectable } from "@nestjs/common";
import { GroupRole } from "../generated/prisma/client";
import { CreateProfileInput } from "@repo/validation";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(userId: string) {
    return this.prisma.profile.findMany({
      where: {
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
      include: {
        familyGroup: {
          include: {
            members: true,
          },
        },
        insuranceProvider: true,
      },
      orderBy: [{ isSelf: "desc" }, { name: "asc" }],
    });
  }

  async createForUser(userId: string, input: CreateProfileInput) {
    const familyGroupId =
      input.familyGroupId ?? (await this.ensurePrimaryFamilyGroup(userId));

    if (input.familyGroupId) {
      const membership = await this.prisma.groupMember.findUnique({
        where: {
          familyGroupId_userId: {
            familyGroupId: input.familyGroupId,
            userId,
          },
        },
      });

      if (!membership) {
        throw new ForbiddenException(
          "You must belong to a family group before assigning a profile to it.",
        );
      }
    }

    return this.prisma.profile.create({
      data: {
        ownerId: userId,
        familyGroupId,
        insuranceProviderId: input.insuranceProviderId,
        name: input.name,
        isSelf: input.isSelf,
        birthDate: new Date(input.birthDate),
        biologicalSex: input.biologicalSex,
        riskFactors: input.riskFactors,
      },
    });
  }

  private async ensurePrimaryFamilyGroup(userId: string): Promise<string> {
    const existingMembership = await this.prisma.groupMember.findFirst({
      where: {
        userId,
        role: GroupRole.ADMIN,
      },
      select: {
        familyGroupId: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (existingMembership) {
      return existingMembership.familyGroupId;
    }

    const group = await this.prisma.familyGroup.create({
      data: {
        name: "Primary Household",
        members: {
          create: {
            userId,
            role: GroupRole.ADMIN,
          },
        },
      },
    });

    return group.id;
  }
}
