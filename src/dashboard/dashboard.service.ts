import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreaksService } from '../streaks/streaks.service';
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
  ) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
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

    const todayPrayers = ALL_PRAYERS.map((prayerName) => {
      const log = todayLogs.find((l) => l.prayerName === prayerName);
      return {
        prayerName,
        status: log?.status ?? null,
        inMosque: log?.inMosque ?? false,
        points: log?.points ?? 0,
        prayedAt: log?.prayedAt ?? null,
      };
    });

    return {
      currentStreak,
      bestStreak,
      monthlyPoints,
      completionRate,
      todayPrayers,
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