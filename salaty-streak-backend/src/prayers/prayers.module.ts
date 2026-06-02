import { Module } from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { PrayersController } from './prayers.controller';
import { DailySummaryModule } from '../daily-summary/daily-summary.module';
import { PrayerTimesModule } from '../prayer-times/prayer-times.module';

@Module({
  imports: [DailySummaryModule, PrayerTimesModule],
  controllers: [PrayersController],
  providers: [PrayersService],
  exports: [PrayersService],
})
export class PrayersModule {}