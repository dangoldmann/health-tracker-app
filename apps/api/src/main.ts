import "reflect-metadata";

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { RuntimeAppEnv } from "@repo/validation";

import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService =
    app.get<ConfigService<RuntimeAppEnv, true>>(ConfigService);
  const apiPrefix = configService.getOrThrow("API_PREFIX", { infer: true });
  const port = configService.getOrThrow("PORT", { infer: true });

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ origin: ["http://localhost:8081"] });

  await app.listen(port);
}

void bootstrap();
