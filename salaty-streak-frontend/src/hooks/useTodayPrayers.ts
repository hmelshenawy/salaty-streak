'use client';

import { useState, useEffect, useCallback } from 'react';
import { PrayerLog } from '@/types/prayer';
import { prayersService } from '@/services/prayers.service';

export function useTodayPrayers() {
  const [prayers, setPrayers] = useState<PrayerLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await prayersService.getToday();
      setPrayers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prayers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrayers();
  }, [fetchPrayers]);

  return { prayers, loading, error, refresh: fetchPrayers };
}