'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface BestStreakCardProps {
  bestStreak: number;
}

export function BestStreakCard({ bestStreak }: BestStreakCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Best Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
            <Trophy className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="text-3xl font-bold">{bestStreak}</div>
            <p className="text-xs text-muted-foreground">
              day{bestStreak !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}