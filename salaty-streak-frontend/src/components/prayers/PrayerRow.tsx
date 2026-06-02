'use client';

import { PrayerLog } from '@/types/prayer';
import { PRAYER_LABELS, PRAYER_ICONS } from '@/lib/constants';
import { PrayerStatusBadge } from './PrayerStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { prayersService } from '@/services/prayers.service';

interface PrayerRowProps {
  prayer: PrayerLog;
  onDeleted?: () => void;
}

export function PrayerRow({ prayer, onDeleted }: PrayerRowProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this prayer log?')) return;
    setDeleting(true);
    try {
      await prayersService.remove(prayer.id);
      onDeleted?.();
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-card ring-1 ring-foreground/5">
      <div className="flex items-center gap-3">
        <span className="text-lg">{PRAYER_ICONS[prayer.prayerName]}</span>
        <div>
          <span className="font-medium">{PRAYER_LABELS[prayer.prayerName]}</span>
          {prayer.inMosque && (
            <Badge variant="outline" className="ml-2 text-primary border-primary/30">
              🕌 Mosque
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <PrayerStatusBadge status={prayer.status} />
        <span className="text-sm font-medium">
          {prayer.points > 0 ? '+' : ''}{prayer.points} pts
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={deleting}
          className="text-muted-foreground hover:text-destructive h-12 w-12"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}