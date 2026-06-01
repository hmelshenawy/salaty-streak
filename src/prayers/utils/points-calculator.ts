import { PrayerName, PrayerStatus } from '@prisma/client';

/**
 * Calculate points for a prayer log entry based on the PRD rules:
 * - On Time: 5 points
 * - Late: 1 point
 * - Missed: -10 points
 * - In Mosque bonus: +21 (only if not missed)
 * - Fajr On Time bonus: +15
 */
export function calculatePrayerPoints(
  status: PrayerStatus,
  inMosque: boolean,
  prayerName: PrayerName,
): number {
  let points = 0;

  switch (status) {
    case 'ON_TIME':
      points = 5;
      break;
    case 'LATE':
      points = 1;
      break;
    case 'MISSED':
      points = -10;
      break;
  }

  if (inMosque && status !== 'MISSED') {
    points += 21;
  }

  if (prayerName === 'FAJR' && status === 'ON_TIME') {
    points += 15;
  }

  return points;
}