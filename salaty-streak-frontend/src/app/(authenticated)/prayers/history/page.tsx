'use client';

import { useState } from 'react';
import { usePrayerHistory } from '@/hooks/usePrayerHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PrayerRow } from '@/components/prayers/PrayerRow';
import { format } from 'date-fns';

function getMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = format(date, 'yyyy-MM');
    const label = format(date, 'MMMM yyyy');
    options.push({ value, label });
  }
  return options;
}

export default function PrayerHistoryPage() {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const { prayers, loading, refresh } = usePrayerHistory(selectedMonth);

  const monthOptions = getMonthOptions();

  const groupedByDate = prayers.reduce((acc, prayer) => {
    const date = prayer.date.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(prayer);
    return acc;
  }, {} as Record<string, typeof prayers>);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">History</h1>
        <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v ?? currentMonth); }}>
          <SelectTrigger className="w-full md:w-48 h-12">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : prayers.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No prayer logs found for this month.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByDate)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, datePrayers]) => (
              <Card key={date} className="overflow-hidden">
                <CardHeader className="pb-2 bg-muted/30">
                  <CardTitle className="text-sm font-medium">
                    {format(new Date(date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                  {datePrayers.map((prayer) => (
                    <PrayerRow key={prayer.id} prayer={prayer} onDeleted={refresh} />
                  ))}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}