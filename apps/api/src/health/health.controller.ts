import { Controller, Get } from '@nestjs/common';
import {
  healthResponseSchema,
  type HealthResponse,
} from '@repo/validation';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({
      service: 'api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
