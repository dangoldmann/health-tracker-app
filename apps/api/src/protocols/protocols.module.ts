import { Module } from "@nestjs/common";

import { AccessControlModule } from "../access-control/access-control.module";
import { ProtocolsController } from "./protocols.controller";
import { ProtocolsService } from "./protocols.service";

@Module({
  imports: [AccessControlModule],
  controllers: [ProtocolsController],
  providers: [ProtocolsService],
})
export class ProtocolsModule {}
