import { HealthService } from './health.service';

describe('HealthService', () => {
  it('returns the shared health contract', () => {
    const service = new HealthService();

    expect(service.getHealth()).toMatchObject({
      service: 'api',
      status: 'ok',
    });
  });
});
