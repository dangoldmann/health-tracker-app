import { Injectable } from "@nestjs/common";
import { RegisterUserInput } from "@repo/validation";

import { PrismaService } from "../prisma/prisma.service";
import {
  appUserSelect,
  toAppUserResponse,
} from "../users/user-state.presenter";
import type { ActiveUser } from "./types/active-user.type";
import type { IdentityClaims } from "./types/identity-claims.type";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveActiveUser(identity: IdentityClaims): Promise<ActiveUser> {
    const user = await this.prisma.user.upsert({
      where: {
        externalAuthId: identity.subject,
      },
      update: {
        email: identity.email,
        authProvider: identity.provider,
      },
      create: {
        email: identity.email,
        externalAuthId: identity.subject,
        authProvider: identity.provider,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      externalAuthId: user.externalAuthId,
      provider: user.authProvider,
      claims: identity.claims,
    };
  }

  async registerCurrentUser(activeUser: ActiveUser, input: RegisterUserInput) {
    const user = await this.prisma.user.update({
      where: {
        id: activeUser.userId,
      },
      data: {
        email: input.email,
        authProvider: input.provider,
        timezone: input.timezone,
      },
      select: appUserSelect,
    });

    return toAppUserResponse(user);
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: appUserSelect,
    });

    return toAppUserResponse(user);
  }
}
