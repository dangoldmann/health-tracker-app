import { Inject, Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(
    @Inject(PrismaService) private readonly prismaService: PrismaService,
  ) {}

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByAuthUserId(authUserId: string) {
    return this.prismaService.user.findUnique({
      where: {
        authUserId,
      },
    });
  }
}
