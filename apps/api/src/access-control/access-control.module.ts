import { Module } from "@nestjs/common";

import { AccessControlService } from "./access-control.service";
import { ProfileAccessGuard } from "./profile-access.guard";

@Module({
  providers: [AccessControlService, ProfileAccessGuard],
  exports: [AccessControlService, ProfileAccessGuard],
})
export class AccessControlModule {}
