import "reflect-metadata";

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { AppEnv } from "@repo/validation";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<AppEnv, true>>(ConfigService);
  const apiPrefix = configService.getOrThrow("API_PREFIX", { infer: true });
  const port = configService.getOrThrow("PORT", { infer: true });

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);
}

void bootstrap();
