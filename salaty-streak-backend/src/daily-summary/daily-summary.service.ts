import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailySummaryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Recalculate the daily summary for a given user and date.
   * Called after any prayer log mutation (create/update/delete).
   */
  async recalculate(userId: string, date: Date) {
    const prayerLogs = await this.prisma.prayerLog.findMany({
      where: {
        userId,
        date,
      },
    });

    const completedPrayers = prayerLogs.filter(
      (log) => log.status !== 'MISSED',
    ).length;

    const missedPrayers = prayerLogs.filter(
      (log) => log.status === 'MISSED',
    ).length;

    const totalPoints = prayerLogs.reduce((sum, log) => sum + log.points, 0);

    const isStreakDay = completedPrayers === 5;

    return this.prisma.dailySummary.upsert({
      where: {
        userId_date: { userId, date },
      },
      create: {
        userId,
        date,
        totalPoints,
        completedPrayers,
        missedPrayers,
        isStreakDay,
      },
      update: {
        totalPoints,
        completedPrayers,
        missedPrayers,
        isStreakDay,
      },
    });
  }
}