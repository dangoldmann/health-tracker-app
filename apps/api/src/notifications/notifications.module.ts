import { Module } from "@nestjs/common";

import { NotificationsScheduler } from "./notifications.scheduler";

@Module({
  providers: [NotificationsScheduler],
})
export class NotificationsModule {}
