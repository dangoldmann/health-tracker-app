import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthenticatedGuard } from "./authenticated.guard";
import { IdentityService } from "./identity.service";

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthenticatedGuard, IdentityService],
  exports: [AuthService, AuthenticatedGuard, IdentityService],
})
export class AuthModule {}
