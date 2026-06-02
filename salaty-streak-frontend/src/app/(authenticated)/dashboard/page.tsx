'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { PrayerCardList } from '@/components/prayers/PrayerCardList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={refresh} className="h-12">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <PrayerCardList
      prayers={data.todayPrayers}
      prayerTimes={data.prayerTimes ?? []}
      currentStreak={data.currentStreak}
      monthlyPoints={data.monthlyPoints}
      completionRate={data.completionRate}
      onPrayerLogged={refresh}
    />
  );
}