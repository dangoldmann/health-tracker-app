import { UnauthorizedException } from '@nestjs/common';
import { TokenExtractorService } from './token-extractor.service';

describe('TokenExtractorService', () => {
  const service = new TokenExtractorService();

  it('extracts a bearer token', () => {
    expect(service.extractBearerToken('Bearer abc123')).toBe('abc123');
  });

  it('rejects a missing authorization header', () => {
    expect(() => service.extractBearerToken()).toThrow(UnauthorizedException);
  });

  it('rejects a non-bearer authorization header', () => {
    expect(() => service.extractBearerToken('Basic abc123')).toThrow(
      UnauthorizedException,
    );
  });
});
