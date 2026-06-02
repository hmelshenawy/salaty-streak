'use client';

import { useState } from 'react';
import { Milestone } from '@/types/milestone';
import { Check, Lock, Pencil, X, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MilestoneRewardInput } from './MilestoneRewardInput';

interface MilestoneCardProps {
  milestone: Milestone;
  currentStreak: number;
}

export function MilestoneCard({ milestone, currentStreak }: MilestoneCardProps) {
  const isLocked = !milestone.completed && milestone.targetDays > currentStreak;
  const progress = Math.min(currentStreak / milestone.targetDays, 1);
  const remainingDays = milestone.targetDays - currentStreak;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl bg-card ring-1 ring-foreground/5 transition-all ${
        milestone.completed
          ? 'ring-primary/20'
          : isLocked
          ? 'opacity-60'
          : ''
      }`}
    >
      {/* Icon / Status */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${
          milestone.completed
            ? 'bg-primary/15 text-primary'
            : isLocked
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary/10 text-primary'
        }`}
      >
        {milestone.completed ? (
          <Check className="h-5 w-5" />
        ) : isLocked ? (
          <Lock className="h-4 w-4" />
        ) : (
          <span>{milestone.icon || milestone.targetDays}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">{milestone.title}</p>
          {milestone.completed && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">
              {milestone.targetDays} days
            </Badge>
          )}
        </div>
        {milestone.completed ? (
          <p className="text-xs text-muted-foreground mt-0.5">
            Achieved{milestone.reward ? ` · ${milestone.reward}` : ''}
          </p>
        ) : (
          <div className="mt-1.5">
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.max(progress * 100, 2)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {remainingDays > 0 ? `${remainingDays} day${remainingDays !== 1 ? 's' : ''} to go` : 'Almost there!'}
            </p>
          </div>
        )}
      </div>

      {/* Reward edit for completed milestones */}
      {milestone.completed && (
        <MilestoneRewardInput
          milestoneId={milestone.id}
          currentReward={milestone.reward}
        />
      )}
    </div>
  );
}