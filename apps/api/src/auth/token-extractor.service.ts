import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TokenExtractorService {
  extractBearerToken(headerValue?: string): string {
    if (!headerValue) {
      throw new UnauthorizedException('Missing Authorization header.');
    }

    const [scheme, token] = headerValue.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization header must use the Bearer scheme.',
      );
    }

    return token;
  }
}
