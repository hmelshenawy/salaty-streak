'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserMilestone } from '@/types/milestone';
import { streaksService } from '@/services/streaks.service';

export function useUnviewedMilestones() {
  const [unviewed, setUnviewed] = useState<UserMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnviewed = useCallback(async () => {
    try {
      setLoading(true);
      const result = await streaksService.getUnviewedMilestones();
      setUnviewed(result);
    } catch {
      // Silently fail — celebration check is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  const markViewed = useCallback(async (milestoneId: string) => {
    try {
      await streaksService.markMilestoneViewed(milestoneId);
      setUnviewed((prev) => prev.filter((m) => m.milestoneId !== milestoneId));
    } catch {
      // Silently fail
    }
  }, []);

  // Check on mount and when tab regains focus
  useEffect(() => {
    fetchUnviewed();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchUnviewed();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchUnviewed]);

  return { unviewed, loading, markViewed, checkAgain: fetchUnviewed };
}