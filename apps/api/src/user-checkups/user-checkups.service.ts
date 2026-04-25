import { BadRequestException, Injectable } from "@nestjs/common";
import { CheckupStatus } from "@prisma/client";
import { BulkUpsertUserCheckupsInput } from "@repo/validation";

import { AccessControlService } from "../access-control/access-control.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserCheckupsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async bulkUpsert(userId: string, input: BulkUpsertUserCheckupsInput) {
    await this.accessControlService.assertCanAccessProfiles(
      userId,
      input.checkups.map((checkup) => checkup.profileId),
    );

    const slugs = [...new Set(input.checkups.map((checkup) => checkup.type))];
    const checkupTypes = await this.prisma.checkupType.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
    });

    const checkupTypeBySlug = new Map(
      checkupTypes.map((checkupType) => [checkupType.slug, checkupType]),
    );

    return this.prisma.$transaction(
      input.checkups.map((checkup) => {
        const checkupType = checkupTypeBySlug.get(checkup.type);

        if (!checkupType) {
          throw new BadRequestException(
            `Unknown checkup type slug: ${checkup.type}`,
          );
        }

        const timeline = this.computeTimeline(
          checkup.frequencyDays,
          checkup.lastPerformed,
        );

        return this.prisma.userCheckup.upsert({
          where: {
            profileId_checkupTypeId: {
              profileId: checkup.profileId,
              checkupTypeId: checkupType.id,
            },
          },
          update: {
            customFrequencyDays: checkup.frequencyDays,
            lastPerformed: checkup.lastPerformed
              ? new Date(checkup.lastPerformed)
              : null,
            nextDueAt: timeline.nextDueAt,
            status: timeline.status,
          },
          create: {
            profileId: checkup.profileId,
            checkupTypeId: checkupType.id,
            customFrequencyDays: checkup.frequencyDays,
            lastPerformed: checkup.lastPerformed
              ? new Date(checkup.lastPerformed)
              : null,
            nextDueAt: timeline.nextDueAt,
            status: timeline.status,
          },
          include: {
            checkupType: true,
          },
        });
      }),
    );
  }

  async listByProfile(userId: string, profileId: string) {
    await this.accessControlService.assertCanAccessProfile(userId, profileId);

    return this.prisma.userCheckup.findMany({
      where: {
        profileId,
      },
      include: {
        checkupType: true,
        documents: true,
      },
      orderBy: [{ status: "asc" }, { nextDueAt: "asc" }],
    });
  }

  private computeTimeline(frequencyDays: number, lastPerformed?: string) {
    const anchorDate = lastPerformed ? new Date(lastPerformed) : new Date();
    const nextDueAt = new Date(anchorDate);
    nextDueAt.setDate(nextDueAt.getDate() + frequencyDays);

    const status =
      nextDueAt.getTime() < Date.now()
        ? CheckupStatus.OVERDUE
        : CheckupStatus.UPCOMING;

    return {
      nextDueAt,
      status,
    };
  }
}
