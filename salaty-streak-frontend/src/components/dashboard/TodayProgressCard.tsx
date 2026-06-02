'use client';

import { TodayPrayer } from '@/types/dashboard';
import { PRAYER_LABELS, PRAYER_ICONS, STATUS_COLORS, STATUS_LABELS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, X } from 'lucide-react';

interface TodayProgressCardProps {
  prayers: TodayPrayer[];
}

function PrayerStatusIcon({ status }: { status: TodayPrayer['status'] }) {
  if (status === 'ON_TIME') return <Check className="h-4 w-4 text-status-ontime" />;
  if (status === 'LATE') return <Clock className="h-4 w-4 text-status-late" />;
  if (status === 'MISSED') return <X className="h-4 w-4 text-status-missed" />;
  return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
}

export function TodayProgressCard({ prayers }: TodayProgressCardProps) {
  const completed = prayers.filter((p) => p.status !== null).length;
  const total = prayers.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Today&apos;s Progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          {completed}/{total} prayers logged
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prayers.map((prayer) => (
            <div
              key={prayer.prayerName}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{PRAYER_ICONS[prayer.prayerName]}</span>
                <span className="font-medium">{PRAYER_LABELS[prayer.prayerName]}</span>
              </div>
              <div className="flex items-center gap-2">
                {prayer.status ? (
                  <>
                    <Badge
                      variant="secondary"
                      className={`${STATUS_COLORS[prayer.status]} text-white`}
                    >
                      {STATUS_LABELS[prayer.status]}
                    </Badge>
                    {prayer.inMosque && (
                      <Badge variant="outline" className="text-primary border-primary/30">
                        🕌
                      </Badge>
                    )}
                  </>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    Not logged
                  </Badge>
                )}
                <PrayerStatusIcon status={prayer.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}