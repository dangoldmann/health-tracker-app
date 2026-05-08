import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const apiPrefix = process.env.API_PREFIX ?? 'api';
  const port = Number(process.env.PORT ?? 3001);

  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);
}

void bootstrap();
