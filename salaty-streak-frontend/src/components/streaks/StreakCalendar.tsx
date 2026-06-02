'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { usePrayerHistory } from '@/hooks/usePrayerHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export function StreakCalendar() {
  const { data: dashboard } = useDashboard();
  const { prayers } = usePrayerHistory(format(new Date(), 'yyyy-MM'));

  const dayMap = new Map<string, { total: number; points: number }>();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (const prayer of prayers) {
    const dateKey = prayer.date.split('T')[0];
    const existing = dayMap.get(dateKey) || { total: 0, points: 0 };
    existing.total++;
    existing.points += prayer.points;
    dayMap.set(dateKey, existing);
  }

  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayData = dayMap.get(dateStr);
    days.push({
      day: d,
      dateStr,
      prayers: dayData?.total ?? 0,
      points: dayData?.points ?? 0,
      hasData: !!dayData,
    });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = now.getDate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Streak Calendar</CardTitle>
        <p className="text-sm text-muted-foreground">
          {format(now, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => (
            <div
              key={day.day}
              className={`min-h-10 min-w-10 rounded-lg flex flex-col items-center justify-center text-xs ${
                day.day === today
                  ? 'ring-2 ring-primary'
                  : ''
              } ${
                day.hasData
                  ? day.prayers >= 5
                    ? 'bg-status-ontime-bg text-status-ontime'
                    : day.prayers > 0
                      ? 'bg-status-late-bg text-status-late'
                      : ''
                  : 'bg-muted/30 text-muted-foreground'
              }`}
            >
              <span className="font-medium">{day.day}</span>
              {day.hasData && (
                <span className="text-[10px] leading-none">{day.points}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}