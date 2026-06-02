'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PrayerStatus } from '@/types/prayer';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';

interface PrayerStatusBadgeProps {
  status: PrayerStatus;
  className?: string;
}

export function PrayerStatusBadge({ status, className }: PrayerStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(STATUS_COLORS[status], 'text-white', className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}