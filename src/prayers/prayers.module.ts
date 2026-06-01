import { Module } from '@nestjs/common';
import { PrayersService } from './prayers.service';
import { PrayersController } from './prayers.controller';
import { DailySummaryModule } from '../daily-summary/daily-summary.module';

@Module({
  imports: [DailySummaryModule],
  controllers: [PrayersController],
  providers: [PrayersService],
  exports: [PrayersService],
})
export class PrayersModule {}