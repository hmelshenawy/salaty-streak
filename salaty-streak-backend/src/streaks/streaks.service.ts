import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfDay, differenceInDays, subDays } from 'date-fns';

export interface StreakResult {
  currentStreak: number;
  bestStreak: number;
}

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate current and best streaks for a user.
   * A streak day is achieved when all 5 prayers are completed (isStreakDay = true).
   * Walks backwards from today to count consecutive streak days.
   */
  async calculateStreaks(userId: string): Promise<StreakResult> {
    const summaries = await this.prisma.dailySummary.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    if (summaries.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    // Build a Set of dates that are streak days for O(1) lookup
    const streakDaySet = new Set<string>();
    const summaryMap = new Map<string, boolean>();

    for (const summary of summaries) {
      const dateKey = startOfDay(summary.date).toISOString().split('T')[0];
      summaryMap.set(dateKey, summary.isStreakDay);
      if (summary.isStreakDay) {
        streakDaySet.add(dateKey);
      }
    }

    // Calculate current streak
    const today = startOfDay(new Date());
    let currentStreak = 0;
    let checkDate = today;

    // If today doesn't have a summary yet, start checking from yesterday
    const todayKey = today.toISOString().split('T')[0];
    if (!summaryMap.has(todayKey)) {
      checkDate = subDays(today, 1);
    }

    // Walk backwards counting consecutive streak days
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const isStreak = summaryMap.get(dateKey);

      if (isStreak === true) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
      } else {
        // If no summary exists for this day, the streak is broken
        // If isStreak is false, the streak is also broken
        break;
      }
    }

    // Calculate best streak
    const sortedDates = Array.from(streakDaySet).sort();
    let bestStreak = 0;
    let currentBest = sortedDates.length > 0 ? 1 : 0;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diff = differenceInDays(currDate, prevDate);

      if (diff === 1) {
        currentBest++;
      } else {
        bestStreak = Math.max(bestStreak, currentBest);
        currentBest = 1;
      }
    }
    bestStreak = Math.max(bestStreak, currentBest);

    // If currentStreak > 0 and bestStreak hasn't been set yet
    if (bestStreak === 0 && currentStreak > 0) {
      bestStreak = currentStreak;
    }

    return { currentStreak, bestStreak };
  }
}