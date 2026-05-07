import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { IdentityService } from './identity.service';

@Injectable()
export class PrismaIdentityService extends IdentityService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByExternalAuthId(externalAuthId: string) {
    return this.prisma.user.findUnique({
      where: { externalAuthId },
      select: {
        id: true,
        email: true,
        externalAuthId: true,
      },
    });
  }
}
