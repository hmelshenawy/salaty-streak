'use client';

import { useUnviewedMilestones } from '@/hooks/useUnviewedMilestones';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function MilestoneCelebration() {
  const { unviewed, markViewed } = useUnviewedMilestones();

  if (unviewed.length === 0) return null;

  const current = unviewed[0];
  const milestone = current.milestone;

  return (
    <Dialog open onOpenChange={(open) => { if (!open) markViewed(current.milestoneId); }}>
      <DialogContent className="text-center max-w-sm">
        <DialogHeader className="items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary text-3xl mb-2">
            {milestone.icon || <Sparkles className="h-8 w-8" />}
          </div>
          <DialogTitle className="text-xl">MashaAllah! 🎉</DialogTitle>
          <DialogDescription className="text-base text-foreground/80 mt-1">
            You achieved <strong>{milestone.title}</strong> — {milestone.targetDays} consecutive days of prayer!
          </DialogDescription>
        </DialogHeader>

        {milestone.description && (
          <p className="text-sm text-muted-foreground">{milestone.description}</p>
        )}

        <DialogClose
          render={<Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium" />}
        >
          Alhamdulillah!
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}