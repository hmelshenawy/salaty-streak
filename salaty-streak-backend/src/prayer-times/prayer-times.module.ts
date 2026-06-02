import { Module } from '@nestjs/common';
import { PrayerTimesService } from './prayer-times.service';
import { PrayerTimesController } from './prayer-times.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrayerTimesController],
  providers: [PrayerTimesService],
  exports: [PrayerTimesService],
})
export class PrayerTimesModule {}