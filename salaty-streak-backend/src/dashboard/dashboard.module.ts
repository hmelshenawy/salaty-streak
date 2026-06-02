import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StreaksModule } from '../streaks/streaks.module';
import { MilestonesModule } from '../milestones/milestones.module';
import { PrayerTimesModule } from '../prayer-times/prayer-times.module';

@Module({
  imports: [PrismaModule, StreaksModule, MilestonesModule, PrayerTimesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}