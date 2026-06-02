import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreaksService } from '../streaks/streaks.service';
import { MilestonesService } from '../milestones/milestones.service';
import { PrayerTimesService } from '../prayer-times/prayer-times.service';
import { getTodayInTimezone, getMonthRange } from '../common/utils/date.utils';
import { PrayerName } from '@prisma/client';

const ALL_PRAYERS: PrayerName[] = [
  'FAJR',
  'DHUHR',
  'ASR',
  'MAGHRIB',
  'ISHA',
];

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private streaksService: StreaksService,
    private milestonesService: MilestonesService,
    private prayerTimesService: PrayerTimesService,
  ) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true, latitude: true, longitude: true },
    });

    const timezone = user?.timezone ?? 'Asia/Dubai';
    const today = getTodayInTimezone(timezone);

    // Get streaks
    const { currentStreak, bestStreak } =
      await this.streaksService.calculateStreaks(userId);

    // Get monthly points
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const { start, end } = getMonthRange(timezone, year, month);

    const monthlySummary = await this.prisma.dailySummary.aggregate({
      where: {
        userId,
        date: { gte: start, lte: end },
      },
      _sum: { totalPoints: true },
    });

    const monthlyPoints = monthlySummary._sum.totalPoints ?? 0;

    // Get completion rate
    const totalDaysThisMonth =
      differenceInDays(end, start) + 1;
    const completedDays = await this.prisma.dailySummary.count({
      where: {
        userId,
        date: { gte: start, lte: end },
        isStreakDay: true,
      },
    });

    const completionRate =
      totalDaysThisMonth > 0
        ? Math.round((completedDays / totalDaysThisMonth) * 100 * 100) / 100
        : 0;

    // Get today's prayers
    const todayLogs = await this.prisma.prayerLog.findMany({
      where: { userId, date: today },
    });

    // Get prayer times with full window/period info
    const prayerTimes = await this.prayerTimesService.getPrayerTimes(
      userId,
      timezone,
      user?.latitude ?? undefined,
      user?.longitude ?? undefined,
    );

    const todayPrayers = ALL_PRAYERS.map((prayerName) => {
      const log = todayLogs.find((l) => l.prayerName === prayerName);
      const pt = prayerTimes.times.find((t) => t.prayerName === prayerName);
      return {
        prayerName,
        status: log?.status ?? null,
        inMosque: log?.inMosque ?? false,
        points: log?.points ?? 0,
        prayedAt: log?.prayedAt ?? null,
        prayerTime: pt?.time ?? null,
        // Full prayer time window info for countdown & period calculation
        prayerTimestamp: pt?.timestamp ?? null,
        prayerEndTime: pt?.endTime ?? null,
        windowMinutes: pt?.windowMinutes ?? 0,
        periods: pt?.periods ?? [],
      };
    });

    // Get next milestone
    const nextMilestone = await this.milestonesService.getNextMilestone(userId);

    return {
      currentStreak,
      bestStreak,
      monthlyPoints,
      completionRate,
      todayPrayers,
      nextMilestone,
      prayerTimes: prayerTimes.times.map((t) => ({
        prayerName: t.prayerName,
        time: t.time,
        timestamp: t.timestamp,
        endTime: t.endTime,
        windowMinutes: t.windowMinutes,
        periods: t.periods,
      })),
      timezone,
    };
  }
}

// Helper for date difference
function differenceInDays(dateLeft: Date, dateRight: Date): number {
  const msPerDay = 86400000;
  return Math.round(
    (dateLeft.getTime() - dateRight.getTime()) / msPerDay,
  );
}