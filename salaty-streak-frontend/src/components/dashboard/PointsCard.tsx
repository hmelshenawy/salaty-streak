'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

interface PointsCardProps {
  monthlyPoints: number;
}

export function PointsCard({ monthlyPoints }: PointsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Monthly Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15">
            <Star className="h-6 w-6 text-accent-foreground" />
          </div>
          <div>
            <div className="text-3xl font-bold">{monthlyPoints}</div>
            <p className="text-xs text-muted-foreground">points this month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}