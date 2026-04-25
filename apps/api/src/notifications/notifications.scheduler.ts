import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CheckupStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NotificationsScheduler {
  private readonly logger = new Logger(NotificationsScheduler.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async dispatchDailyPreventiveScan() {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const [overdue, upcoming] = await Promise.all([
      this.prisma.userCheckup.count({
        where: {
          status: CheckupStatus.OVERDUE,
        },
      }),
      this.prisma.userCheckup.count({
        where: {
          status: CheckupStatus.UPCOMING,
          nextDueAt: {
            lte: sevenDaysFromNow,
          },
        },
      }),
    ]);

    this.logger.log(
      `Daily preventive scan completed: ${overdue} overdue and ${upcoming} due soon.`,
    );
  }
}
