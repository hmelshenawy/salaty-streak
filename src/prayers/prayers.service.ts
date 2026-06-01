import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrayerLogDto } from './dto/create-prayer-log.dto';
import { UpdatePrayerLogDto } from './dto/update-prayer-log.dto';
import { calculatePrayerPoints } from './utils/points-calculator';
import { getTodayInTimezone, getMonthRange, parseDateString } from '../common/utils/date.utils';
import { DailySummaryService } from '../daily-summary/daily-summary.service';

@Injectable()
export class PrayersService {
  constructor(
    private prisma: PrismaService,
    private dailySummaryService: DailySummaryService,
  ) {}

  async create(userId: string, dto: CreatePrayerLogDto) {
    const date = parseDateString(dto.date);

    // Prevent logging prayers for future dates
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (date > today) {
      throw new BadRequestException('Cannot log prayers for future dates');
    }

    const inMosque = dto.inMosque ?? false;
    const points = calculatePrayerPoints(dto.status, inMosque, dto.prayerName);
    const prayedAt = dto.prayedAt ? new Date(dto.prayedAt) : null;

    try {
      const prayerLog = await this.prisma.prayerLog.create({
        data: {
          userId,
          prayerName: dto.prayerName,
          date,
          status: dto.status,
          inMosque,
          points,
          prayedAt,
        },
      });

      await this.dailySummaryService.recalculate(userId, date);

      return prayerLog;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Prayer already logged for this date and prayer name',
        );
      }
      throw error;
    }
  }

  async getToday(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const timezone = user?.timezone ?? 'Asia/Dubai';
    const today = getTodayInTimezone(timezone);

    return this.prisma.prayerLog.findMany({
      where: {
        userId,
        date: today,
      },
      orderBy: { prayerName: 'asc' },
    });
  }

  async getHistory(userId: string, month?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    });

    const timezone = user?.timezone ?? 'Asia/Dubai';

    let year: number;
    let monthNum: number;

    if (month) {
      const [y, m] = month.split('-').map(Number);
      year = y;
      monthNum = m;
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNum = now.getMonth() + 1;
    }

    const { start, end } = getMonthRange(timezone, year, monthNum);

    return this.prisma.prayerLog.findMany({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: [{ date: 'asc' }, { prayerName: 'asc' }],
    });
  }

  async update(userId: string, prayerId: string, dto: UpdatePrayerLogDto) {
    const existing = await this.prisma.prayerLog.findUnique({
      where: { id: prayerId },
    });

    if (!existing) {
      throw new NotFoundException('Prayer log not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not own this prayer log');
    }

    const status = dto.status ?? existing.status;
    const inMosque = dto.inMosque ?? existing.inMosque;
    const points = calculatePrayerPoints(status, inMosque, existing.prayerName);
    const prayedAt = dto.prayedAt ? new Date(dto.prayedAt) : existing.prayedAt;

    const updated = await this.prisma.prayerLog.update({
      where: { id: prayerId },
      data: {
        status,
        inMosque,
        points,
        prayedAt,
      },
    });

    await this.dailySummaryService.recalculate(userId, existing.date);

    return updated;
  }

  async remove(userId: string, prayerId: string) {
    const existing = await this.prisma.prayerLog.findUnique({
      where: { id: prayerId },
    });

    if (!existing) {
      throw new NotFoundException('Prayer log not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('You do not own this prayer log');
    }

    await this.prisma.prayerLog.delete({
      where: { id: prayerId },
    });

    await this.dailySummaryService.recalculate(userId, existing.date);
  }
}