import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrayerLogDto } from './dto/create-prayer-log.dto';
import { QuickPrayerDto } from './dto/quick-prayer.dto';
import { UpdatePrayerLogDto } from './dto/update-prayer-log.dto';
import { calculatePrayerPoints } from './utils/points-calculator';
import { getTodayInTimezone, getMonthRange, parseDateString } from '../common/utils/date.utils';
import { DailySummaryService } from '../daily-summary/daily-summary.service';
import { MilestonesService } from '../milestones/milestones.service';
import { PrayerTimesService } from '../prayer-times/prayer-times.service';
import { PrayerStatus } from '@prisma/client';

@Injectable()
export class PrayersService {
  constructor(
    private prisma: PrismaService,
    private dailySummaryService: DailySummaryService,
    private milestonesService: MilestonesService,
    private prayerTimesService: PrayerTimesService,
  ) {}

  /**
   * Quick log: auto-determine status based on current time and prayer periods.
   * - Within "early" or "mid" period → ON_TIME
   * - Within "late" period → LATE
   * - Past the prayer's end time → LATE
   * - Before prayer starts → ON_TIME (praying early/on time)
   */
  async quickLog(userId: string, dto: QuickPrayerDto) {
    const date = parseDateString(dto.date);

    // Prevent logging prayers for future dates
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (date > today) {
      throw new BadRequestException('Cannot log prayers for future dates');
    }

    // Get user timezone and coordinates for prayer times
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true, latitude: true, longitude: true },
    });

    const timezone = user?.timezone ?? 'Asia/Dubai';
    const prayerTimes = await this.prayerTimesService.getPrayerTimes(
      userId,
      timezone,
      user?.latitude ?? undefined,
      user?.longitude ?? undefined,
    );

    const now = Date.now();
    let status: PrayerStatus;

    // Find the prayer time entry
    const pt = prayerTimes.times.find(t => t.prayerName === dto.prayerName);

    if (!pt) {
      // Fallback: no prayer time data, default to ON_TIME
      status = 'ON_TIME';
    } else {
      const start = new Date(pt.timestamp).getTime();
      const end = new Date(pt.endTime).getTime();

      if (now >= end) {
        // Past the window → MISSED (window closed, too late)
        status = 'MISSED';
      } else if (now < start) {
        // Praying before prayer time starts → ON_TIME
        status = 'ON_TIME';
      } else {
        // Within the window — check which period
        const elapsedMinutes = (now - start) / 60000;
        const currentPeriod = pt.periods.find(
          p => elapsedMinutes >= p.startOffset && elapsedMinutes < p.endOffset,
        );

        if (currentPeriod) {
          status = currentPeriod.label === 'late' ? 'LATE' : 'ON_TIME';
        } else {
          // Fallback if period not found
          status = 'ON_TIME';
        }
      }
    }

    const inMosque = dto.inMosque ?? false;
    const points = calculatePrayerPoints(status, inMosque, dto.prayerName);

    try {
      const prayerLog = await this.prisma.prayerLog.create({
        data: {
          userId,
          prayerName: dto.prayerName,
          date,
          status,
          inMosque,
          points,
          prayedAt: new Date(),
        },
      });

      await this.dailySummaryService.recalculate(userId, date);
      await this.milestonesService.checkMilestones(userId).catch(() => {});

      return { ...prayerLog, autoStatus: status };
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Prayer already logged for this date and prayer name',
        );
      }
      throw error;
    }
  }

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
      await this.milestonesService.checkMilestones(userId).catch(() => {});

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
    await this.milestonesService.checkMilestones(userId).catch(() => {});

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
    await this.milestonesService.checkMilestones(userId).catch(() => {});
  }
}