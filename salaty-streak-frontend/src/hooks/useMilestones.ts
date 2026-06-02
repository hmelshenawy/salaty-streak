'use client';

import { useState, useEffect, useCallback } from 'react';
import { Milestone } from '@/types/milestone';
import { streaksService } from '@/services/streaks.service';

export function useMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await streaksService.getMilestones();
      setMilestones(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load milestones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
  }, [fetchMilestones]);

  return { milestones, loading, error, refresh: fetchMilestones };
}