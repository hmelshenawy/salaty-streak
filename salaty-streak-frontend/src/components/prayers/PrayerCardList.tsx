'use client';

import { useState, useEffect } from 'react';
import { Flame, Star, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUnviewedMilestones } from '@/hooks/useUnviewedMilestones';
import { PrayerCard } from './PrayerCard';
import { NextPrayerCountdown } from './NextPrayerCountdown';
import { TodayPrayer, PrayerTimeEntry } from '@/types/dashboard';
import { PrayerName, PrayerStatus } from '@/types/prayer';
import { PRAYER_ORDER } from '@/lib/constants';

interface PrayerCardListProps {
  prayers: TodayPrayer[];
  prayerTimes: PrayerTimeEntry[];
  currentStreak: number;
  monthlyPoints: number;
  completionRate: number;
  onPrayerLogged: () => void;
}

/**
 * Determine which prayers are "past" (their time window has ended).
 */
function getPastPrayers(prayerTimes: PrayerTimeEntry[]): Set<PrayerName> {
  const now = Date.now();
  const past = new Set<PrayerName>();

  if (prayerTimes.length === 0) return past;

  for (const pt of prayerTimes) {
    const endTime = new Date(pt.endTime).getTime();
    if (now >= endTime) {
      past.add(pt.prayerName);
    }
  }

  // Special case: before Fajr, no prayers are past yet
  const fajrStart = prayerTimes.find(t => t.prayerName === 'FAJR');
  if (fajrStart && now < new Date(fajrStart.timestamp).getTime()) {
    past.clear();
  }

  return past;
}

/**
 * Find the next upcoming prayer (not yet started or currently in its window).
 */
function getNextPrayer(prayerTimes: PrayerTimeEntry[]): PrayerTimeEntry | null {
  const now = Date.now();
  
  for (const pt of prayerTimes) {
    const start = new Date(pt.timestamp).getTime();
    const end = new Date(pt.endTime).getTime();
    // Current or upcoming prayer
    if (now < end) {
      return pt;
    }
  }
  return null;
}

/**
 * Check if a prayer is currently in its active window.
 */
function isCurrentPrayer(prayerName: PrayerName, prayerTimes: PrayerTimeEntry[]): boolean {
  const now = Date.now();
  const pt = prayerTimes.find(t => t.prayerName === prayerName);
  if (!pt) return false;
  const start = new Date(pt.timestamp).getTime();
  const end = new Date(pt.endTime).getTime();
  return now >= start && now < end;
}

export function PrayerCardList({
  prayers,
  prayerTimes,
  currentStreak,
  monthlyPoints,
  completionRate,
  onPrayerLogged,
}: PrayerCardListProps) {
  const { user } = useAuth();
  const { checkAgain: checkMilestones } = useUnviewedMilestones();
  const completedCount = prayers.filter((p) => p.status).length;

  // Force re-render every 30 seconds for countdown updates
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePrayerLogged = () => {
    onPrayerLogged();
    setTimeout(() => checkMilestones(), 1500);
  };

  // Determine which prayers are past their time slot
  const pastPrayers = getPastPrayers(prayerTimes);

  // Find next prayer for countdown
  const nextPrayer = getNextPrayer(prayerTimes);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {/* Greeting & date */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Assalamu Alaikum{user?.name ? `, ${user.name}` : ''}
          </h1>
          {currentStreak > 0 && (
            <div className="flex items-center gap-1 text-accent-foreground bg-accent/15 px-2.5 py-1 rounded-full">
              <Flame className="h-4 w-4 text-accent" />
              <span className="text-sm font-semibold">{currentStreak}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
      </div>

      {/* Next prayer countdown */}
      {nextPrayer && (
        <div className="mb-4">
          <NextPrayerCountdown
            prayerName={nextPrayer.prayerName}
            timestamp={nextPrayer.timestamp}
            endTime={nextPrayer.endTime}
            windowMinutes={nextPrayer.windowMinutes}
          />
        </div>
      )}

      {/* Prayer cards */}
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer.prayerName}
            prayer={prayer}
            isPast={pastPrayers.has(prayer.prayerName) && !prayer.status}
            isCurrent={isCurrentPrayer(prayer.prayerName, prayerTimes)}
            onLogged={handlePrayerLogged}
          />
        ))}
      </div>

      {/* Compact stats row */}
      <div className="flex items-center justify-center gap-6 mt-5 py-3 px-4 rounded-xl bg-card ring-1 ring-foreground/5">
        <div className="flex items-center gap-1.5 text-sm">
          <Flame className="h-4 w-4 text-accent" />
          <span className="font-semibold">{currentStreak}</span>
          <span className="text-muted-foreground">day{currentStreak !== 1 ? 's' : ''}</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5 text-sm">
          <Star className="h-4 w-4 text-accent" />
          <span className="font-semibold">{monthlyPoints}</span>
          <span className="text-muted-foreground">pts</span>
        </div>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-1.5 text-sm">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-semibold">{completionRate.toFixed(0)}%</span>
          <span className="text-muted-foreground">rate</span>
        </div>
      </div>

      {/* Motivational message */}
      {completedCount > 0 && completedCount < 5 && (
        <p className="text-center text-sm text-muted-foreground mt-3">
          {5 - completedCount} more prayer{5 - completedCount !== 1 ? 's' : ''} to maintain your streak ✨
        </p>
      )}
      {completedCount === 5 && (
        <p className="text-center text-sm text-primary font-medium mt-3">
          All prayers completed today! MashaAllah 🌙
        </p>
      )}
    </div>
  );
}