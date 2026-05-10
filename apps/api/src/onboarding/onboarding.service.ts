import {
  BadRequestException,
  Inject,
  Injectable,
} from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/interfaces/authenticated-user.interface";
import { PrismaService } from "../prisma/prisma.service";
import type {
  FinalizeOnboardingRequest,
  OnboardingProfileInput,
} from "@repo/validation";
import { ProfileRelationship, type Prisma } from "../generated/prisma/client";
import { randomUUID } from "node:crypto";
import { FinalizeOnboardingResponseDto } from "./dto/finalize-onboarding-response.dto";

@Injectable()
export class OnboardingService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  async finalize(
    authenticatedUser: AuthenticatedUser,
    request: FinalizeOnboardingRequest,
  ): Promise<FinalizeOnboardingResponseDto> {
    return this.prismaService.$transaction(async (transaction) => {
      let user = await transaction.user.findUnique({
        where: {
          authUserId: authenticatedUser.id,
        },
      });

      if (!user) {
        user = await transaction.user.create({
          data: {
            id: randomUUID(),
            authUserId: authenticatedUser.id,
            email: authenticatedUser.email ?? null,
            expoPushToken: request.expoPushToken ?? null,
          },
        });
      } else {
        user = await transaction.user.update({
          where: {
            id: user.id,
          },
          data: {
            email: authenticatedUser.email ?? user.email,
            expoPushToken: request.expoPushToken ?? user.expoPushToken,
          },
        });
      }

      const existingLinks = await transaction.userProfile.count({
        where: {
          userId: user.id,
        },
      });

      if (existingLinks > 0) {
        const existingSummary = await this.getUserOnboardingSummary(
          transaction,
          user.id,
        );

        return FinalizeOnboardingResponseDto.from({
          userId: user.id,
          status: "existing",
          alreadyFinalized: true,
          profiles: existingSummary,
        });
      }

      const checkupTypesBySlug = await this.loadCheckupTypesBySlug(
        transaction,
        request,
      );

      for (const profile of request.profiles) {
        await this.createProfileGraph(
          transaction,
          user.id,
          checkupTypesBySlug,
          profile,
        );
      }

      const createdSummary = await this.getUserOnboardingSummary(
        transaction,
        user.id,
      );

      return FinalizeOnboardingResponseDto.from({
        userId: user.id,
        status: "created",
        alreadyFinalized: false,
        profiles: createdSummary,
      });
    });
  }

  private async loadCheckupTypesBySlug(
    transaction: Prisma.TransactionClient,
    request: FinalizeOnboardingRequest,
  ): Promise<Map<string, { id: string; slug: string }>> {
    const slugs = [
      ...new Set(
        request.profiles.flatMap((profile) =>
          profile.checkups.map((checkup) => checkup.checkupTypeSlug),
        ),
      ),
    ];

    const checkupTypes = await transaction.checkupType.findMany({
      where: {
        slug: {
          in: slugs,
        },
        isActive: true,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const checkupTypesBySlug = new Map(
      checkupTypes.map((checkupType) => [checkupType.slug, checkupType]),
    );

    for (const slug of slugs) {
      if (!checkupTypesBySlug.has(slug)) {
        throw new BadRequestException(
          `Checkup type slug '${slug}' is not available.`,
        );
      }
    }

    return checkupTypesBySlug;
  }

  private async createProfileGraph(
    transaction: Prisma.TransactionClient,
    userId: string,
    checkupTypesBySlug: Map<string, { id: string; slug: string }>,
    profile: OnboardingProfileInput,
  ): Promise<void> {
    const profileRecord = await transaction.profile.create({
      data: {
        id: randomUUID(),
        name: profile.name,
        relationship: profile.relationship,
        birthDate: this.toDateOnly(profile.birthDate),
        biologicalSex: profile.biologicalSex ?? null,
        healthInfo: profile.healthInfo,
      },
    });

    await transaction.userProfile.create({
      data: {
        id: randomUUID(),
        userId,
        profileId: profileRecord.id,
      },
    });

    for (const checkup of profile.checkups) {
      const checkupType = checkupTypesBySlug.get(checkup.checkupTypeSlug);

      if (!checkupType) {
        throw new BadRequestException(
          `Checkup type slug '${checkup.checkupTypeSlug}' is not available.`,
        );
      }

      const profileCheckup = await transaction.profileCheckup.create({
        data: {
          id: randomUUID(),
          profileId: profileRecord.id,
          checkupTypeId: checkupType.id,
          frequencyDays: checkup.frequencyDays,
        },
      });

      if (checkup.initialRecord) {
        await transaction.checkupRecord.create({
          data: {
            id: randomUUID(),
            profileCheckupId: profileCheckup.id,
            performedAt: this.toDateOnly(checkup.initialRecord.performedAt),
            comments: checkup.initialRecord.comments ?? null,
            doctorNotes: checkup.initialRecord.doctorNotes ?? null,
          },
        });
      }
    }
  }

  private async getUserOnboardingSummary(
    transaction: Prisma.TransactionClient,
    userId: string,
  ): Promise<
    Array<{
      id: string;
      name: string;
      relationship: ProfileRelationship;
      checkups: Array<{ id: string; checkupTypeSlug: string }>;
    }>
  > {
    const links = await transaction.userProfile.findMany({
      where: {
        userId,
      },
      select: {
        profile: {
          select: {
            id: true,
            name: true,
            relationship: true,
            checkups: {
              select: {
                id: true,
                checkupType: {
                  select: {
                    slug: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return links.map(({ profile }) => ({
      id: profile.id,
      name: profile.name,
      relationship: profile.relationship,
      checkups: profile.checkups.map((checkup) => ({
        id: checkup.id,
        checkupTypeSlug: checkup.checkupType.slug,
      })),
    }));
  }

  private toDateOnly(value: string): Date {
    return new Date(`${value}T00:00:00.000Z`);
  }
}
