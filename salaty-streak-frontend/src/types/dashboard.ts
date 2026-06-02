import { PrayerName, PrayerStatus } from '@/types/prayer';
import { NextMilestone } from './milestone';

export interface PrayerTimePeriod {
  label: 'early' | 'mid' | 'late';
  startOffset: number;
  endOffset: number;
}

export interface TodayPrayer {
  prayerName: PrayerName;
  status: PrayerStatus | null;
  inMosque: boolean;
  points: number;
  prayedAt: string | null;
  prayerTime: string | null;
  prayerTimestamp: string | null; // ISO date string
  prayerEndTime: string | null;  // ISO date string
  windowMinutes: number;
  periods: PrayerTimePeriod[];
}

export interface PrayerTimeEntry {
  prayerName: PrayerName;
  time: string; // HH:mm
  timestamp: string; // ISO date string
  endTime: string; // ISO date string
  windowMinutes: number;
  periods: PrayerTimePeriod[];
}

export interface DashboardResponse {
  currentStreak: number;
  bestStreak: number;
  monthlyPoints: number;
  completionRate: number;
  todayPrayers: TodayPrayer[];
  nextMilestone: NextMilestone | null;
  prayerTimes: PrayerTimeEntry[];
  timezone: string;
}