import {
  CanActivate,
  Injectable,
  UnauthorizedException,
  type ExecutionContext,
} from "@nestjs/common";

import { AuthService } from "../auth.service";
import type { AuthenticatedRequest } from "../interfaces/authenticated-request.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new UnauthorizedException("Missing Authorization header.");
    }

    const [scheme, token] = authorizationHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Invalid Authorization header.");
    }

    request.user = await this.authService.verifyAccessToken(token);

    return true;
  }
}
