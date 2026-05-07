import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { AppEnv } from '@repo/validation';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppEnv, true>);
  const apiPrefix = configService.get('API_PREFIX', { infer: true });
  const port = configService.get('PORT', { infer: true });

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);

  Logger.log(
    `API listening on http://localhost:${port}/${apiPrefix}`,
    'Bootstrap',
  );
}

void bootstrap();
