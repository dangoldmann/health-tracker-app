import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
}
