'use client';

import { useMilestones } from '@/hooks/useMilestones';
import { useDashboard } from '@/hooks/useDashboard';
import { MilestoneCard } from './MilestoneCard';

export function MilestoneList() {
  const { milestones, loading } = useMilestones();
  const { data } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {milestones.map((milestone) => (
        <MilestoneCard
          key={milestone.id}
          milestone={milestone}
          currentStreak={data?.currentStreak ?? 0}
        />
      ))}
    </div>
  );
}