'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { StreakCalendar } from '@/components/streaks/StreakCalendar';
import { NextMilestoneCard } from '@/components/streaks/NextMilestoneCard';
import { MilestoneList } from '@/components/streaks/MilestoneList';
import { Flame, Trophy } from 'lucide-react';

export default function StreaksPage() {
  const { data, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Streaks</h1>

      {/* Streak summary */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
            <Flame className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="text-3xl font-bold">{data.currentStreak}</div>
            <p className="text-xs text-muted-foreground">current day{data.currentStreak !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5 flex-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
            <Trophy className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="text-3xl font-bold">{data.bestStreak}</div>
            <p className="text-xs text-muted-foreground">personal best</p>
          </div>
        </div>
      </div>

      {/* Next milestone */}
      <NextMilestoneCard nextMilestone={data.nextMilestone} />

      {/* Calendar */}
      <StreakCalendar />

      {/* Milestones */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Milestones</h2>
        <MilestoneList />
      </div>
    </div>
  );
}