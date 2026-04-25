import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";

import { AccessControlModule } from "./access-control/access-control.module";
import { AuthModule } from "./auth/auth.module";
import { AuthenticatedGuard } from "./auth/authenticated.guard";
import { validateEnvironment } from "./config/environment";
import { HealthModule } from "./health/health.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ProtocolsModule } from "./protocols/protocols.module";
import { StorageModule } from "./storage/storage.module";
import { UserCheckupsModule } from "./user-checkups/user-checkups.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AccessControlModule,
    AuthModule,
    HealthModule,
    NotificationsModule,
    ProfilesModule,
    ProtocolsModule,
    StorageModule,
    UserCheckupsModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AppModule {}
