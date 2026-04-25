import { Injectable, NotFoundException } from "@nestjs/common";
import { BiologicalSex, MedicalProtocol, Profile } from "@prisma/client";

import { AccessControlService } from "../access-control/access-control.service";
import { PrismaService } from "../prisma/prisma.service";

type ProfileWithRiskFactors = Profile & {
  riskFactors: Record<string, boolean | number | string>;
};

@Injectable()
export class ProtocolsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessControlService: AccessControlService,
  ) {}

  async generateSuggestions(userId: string, profileIds: string[]) {
    await this.accessControlService.assertCanAccessProfiles(userId, profileIds);

    const profiles = (await this.prisma.profile.findMany({
      where: {
        id: {
          in: profileIds,
        },
      },
    })) as ProfileWithRiskFactors[];

    if (!profiles.length) {
      throw new NotFoundException("No profiles were found for suggestion generation.");
    }

    const [checkupTypes, protocols] = await Promise.all([
      this.prisma.checkupType.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      this.prisma.medicalProtocol.findMany({
        include: {
          checkupType: true,
        },
        orderBy: [{ checkupTypeId: "asc" }, { minAge: "asc" }],
      }),
    ]);

    return profiles.map((profile) => ({
      profileId: profile.id,
      profileName: profile.name,
      suggestions: checkupTypes.map((checkupType) => {
        const candidates = protocols.filter(
          (protocol) => protocol.checkupTypeId === checkupType.id,
        );
        const matchedProtocol = this.matchProtocol(profile, candidates);
        const frequencyDays =
          matchedProtocol?.suggestedFrequencyDays ?? checkupType.baseFrequencyDays;

        return {
          checkupTypeId: checkupType.id,
          slug: checkupType.slug,
          name: checkupType.name,
          frequencyDays,
          sourceProtocolId: matchedProtocol?.id ?? null,
          rationale: matchedProtocol
            ? "Matched age, sex, and optional risk-factor protocol."
            : "Fell back to the default specialty cadence.",
        };
      }),
    }));
  }

  private matchProtocol(
    profile: ProfileWithRiskFactors,
    protocols: Array<MedicalProtocol>,
  ) {
    const age = this.calculateAge(profile.birthDate);

    return protocols
      .filter((protocol) => this.matchesAge(age, protocol))
      .filter((protocol) => this.matchesSex(profile.biologicalSex, protocol.sex))
      .filter((protocol) =>
        this.matchesRiskFactor(profile.riskFactors, protocol.riskFactorKey),
      )
      .sort((left, right) => {
        const leftSpecificity = left.riskFactorKey ? 1 : 0;
        const rightSpecificity = right.riskFactorKey ? 1 : 0;

        return rightSpecificity - leftSpecificity;
      })[0];
  }

  private calculateAge(birthDate: Date) {
    const now = new Date();
    const ageDifference = now.getFullYear() - birthDate.getFullYear();
    const hadBirthdayThisYear =
      now.getMonth() > birthDate.getMonth() ||
      (now.getMonth() === birthDate.getMonth() &&
        now.getDate() >= birthDate.getDate());

    return hadBirthdayThisYear ? ageDifference : ageDifference - 1;
  }

  private matchesAge(age: number, protocol: MedicalProtocol) {
    const meetsMinimum = age >= protocol.minAge;
    const meetsMaximum = protocol.maxAge === null || age <= protocol.maxAge;

    return meetsMinimum && meetsMaximum;
  }

  private matchesSex(
    profileSex: BiologicalSex,
    protocolSex: BiologicalSex | null,
  ) {
    return protocolSex === null || protocolSex === profileSex;
  }

  private matchesRiskFactor(
    riskFactors: Record<string, boolean | number | string>,
    riskFactorKey: string | null,
  ) {
    if (!riskFactorKey) {
      return true;
    }

    return riskFactors[riskFactorKey] === true;
  }
}
