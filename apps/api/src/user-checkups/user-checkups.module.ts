import { Module } from "@nestjs/common";

import { AccessControlModule } from "../access-control/access-control.module";
import { UserCheckupsController } from "./user-checkups.controller";
import { UserCheckupsService } from "./user-checkups.service";

@Module({
  imports: [AccessControlModule],
  controllers: [UserCheckupsController],
  providers: [UserCheckupsService],
})
export class UserCheckupsModule {}
