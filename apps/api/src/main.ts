import "reflect-metadata";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";
import type { Environment } from "./config/environment";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");
  const configService = app.get(ConfigService<Environment, true>);
  const prismaService = app.get(PrismaService);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: configService.get("APP_ORIGIN") ?? true,
    credentials: true,
  });

  await prismaService.enableShutdownHooks(app);

  const port = configService.getOrThrow("PORT");
  await app.listen(port);

  logger.log(`HealthGuard API listening on port ${port}.`);
}

bootstrap();
