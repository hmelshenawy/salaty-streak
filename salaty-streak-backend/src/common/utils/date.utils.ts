import { toZonedTime } from 'date-fns-tz';
import { format, startOfMonth, endOfMonth } from 'date-fns';

/**
 * Get today's calendar date in the user's timezone as a UTC midnight Date.
 * For example: if it's June 2nd 1:00 AM in Dubai (UTC+4),
 * the local date is June 2nd, so we return 2026-06-02T00:00:00.000Z.
 *
 * This matches how `parseDateString` stores dates in the database.
 */
export function getTodayInTimezone(timezone: string): Date {
  const now = new Date();
  const zonedNow = toZonedTime(now, timezone);
  const dateStr = format(zonedNow, 'yyyy-MM-dd');
  return parseDateString(dateStr);
}

/**
 * Get the start and end of a month in the user's timezone as UTC midnight Dates.
 * These can be used for querying prayer logs stored with parseDateString dates.
 */
export function getMonthRange(
  timezone: string,
  year: number,
  month: number,
): { start: Date; end: Date } {
  // Create a date in the target month in the user's timezone
  const dateInMonth = new Date(year, month - 1, 15);
  const zonedDate = toZonedTime(dateInMonth, timezone);

  const zonedStart = startOfMonth(zonedDate);
  const zonedEnd = endOfMonth(zonedDate);

  // Format as YYYY-MM-DD and parse back as UTC midnight
  const startStr = format(zonedStart, 'yyyy-MM-dd');
  const endStr = format(zonedEnd, 'yyyy-MM-dd');

  return {
    start: parseDateString(startStr),
    end: parseDateString(endStr),
  };
}

/**
 * Parse a date string (YYYY-MM-DD) into a UTC Date at midnight,
 * representing that calendar date regardless of timezone.
 * Used for storing prayer log dates consistently in the database.
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}