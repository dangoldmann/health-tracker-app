import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import type { AppEnv } from "@repo/validation";

import { PrismaClient } from "../generated/prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(configService: ConfigService<AppEnv, true>) {
    const connectionString = configService.getOrThrow("DATABASE_URL", {
      infer: true,
    });

    super({
      adapter: new PrismaPg({
        connectionString,
      }),
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
