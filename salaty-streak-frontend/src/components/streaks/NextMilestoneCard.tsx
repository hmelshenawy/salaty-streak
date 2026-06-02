import { NextMilestone } from '@/types/milestone';
import { Target } from 'lucide-react';

interface NextMilestoneCardProps {
  nextMilestone: NextMilestone | null;
}

export function NextMilestoneCard({ nextMilestone }: NextMilestoneCardProps) {
  if (!nextMilestone) return null;

  const progress = nextMilestone.remainingDays === 0
    ? 1
    : Math.max(0, (nextMilestone.targetDays - nextMilestone.remainingDays) / nextMilestone.targetDays);

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Target className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">Next: {nextMilestone.title}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.max(progress * 100, 2)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {nextMilestone.remainingDays > 0
              ? `${nextMilestone.remainingDays} day${nextMilestone.remainingDays !== 1 ? 's' : ''}`
              : 'Done!'}
          </span>
        </div>
      </div>
    </div>
  );
}