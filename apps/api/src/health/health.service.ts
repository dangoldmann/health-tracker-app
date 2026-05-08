import { Injectable } from '@nestjs/common';
import { healthResponseSchema, type HealthResponse } from '@repo/validation';

@Injectable()
export class HealthService {
  getHealth(): HealthResponse {
    return healthResponseSchema.parse({
      service: 'api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }
}
