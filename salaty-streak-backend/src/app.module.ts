import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PrayersModule } from './prayers/prayers.module';
import { StreaksModule } from './streaks/streaks.module';
import { UsersModule } from './users/users.module';
import { DailySummaryModule } from './daily-summary/daily-summary.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MilestonesModule } from './milestones/milestones.module';
import { PrayerTimesModule } from './prayer-times/prayer-times.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PrayersModule,
    StreaksModule,
    DailySummaryModule,
    MilestonesModule,
    PrayerTimesModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}