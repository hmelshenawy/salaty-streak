'use client';

import { useState, useEffect, useCallback } from 'react';
import { PrayerLog } from '@/types/prayer';
import { prayersService } from '@/services/prayers.service';

export function usePrayerHistory(month?: string) {
  const [prayers, setPrayers] = useState<PrayerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await prayersService.getHistory(month);
      setPrayers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prayer history');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { prayers, loading, error, refresh: fetchHistory };
}