import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { Environment } from '../config/environment';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly configService: ConfigService<Environment, true>,
  ) {}

  @Get()
  @Public()
  status() {
    return {
      status: 'ok',
      authProvider: this.configService.getOrThrow('AUTH_PROVIDER_NAME'),
      database: 'postgresql',
      // storage: this.configService.get("STORAGE_ENDPOINT") ? "s3-compatible" : "s3",
    };
  }
}
