import { Controller, Get, Request } from '@nestjs/common';
import { PrayerTimesService } from './prayer-times.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('prayer-times')
export class PrayerTimesController {
  constructor(
    private readonly prayerTimesService: PrayerTimesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('today')
  async getTodayPrayerTimes(@Request() req: { user: { sub: string } }) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { timezone: true, latitude: true, longitude: true },
    });

    return this.prayerTimesService.getPrayerTimes(
      req.user.sub,
      user?.timezone ?? 'Asia/Dubai',
      user?.latitude ?? undefined,
      user?.longitude ?? undefined,
    );
  }
}