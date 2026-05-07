import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { HealthController } from '../src/health/health.controller';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3001';
    process.env.API_PREFIX = 'api';
    process.env.DATABASE_URL =
      'postgresql://postgres:postgres@localhost:5432/health_tracker_test';
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_JWT_AUDIENCE = 'authenticated';
    process.env.SUPABASE_JWT_SECRET = 'test-secret';
    const { AppModule } = await import('../src/app.module');

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('boots the app and returns a health payload', async () => {
    const controller = app.get(HealthController);
    const response = controller.getHealth();

    expect(response.status).toBe('ok');
    expect(response.service).toBe('api');
  });
});
