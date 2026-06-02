import { apiClient } from '@/lib/api';
import { Milestone, NextMilestone, UserMilestone } from '@/types/milestone';

export const streaksService = {
  async getCurrentStreak(): Promise<{ currentStreak: number; bestStreak: number }> {
    return apiClient.get('/streaks/current');
  },

  async getMilestones(): Promise<Milestone[]> {
    return apiClient.get('/streaks/milestones');
  },

  async getNextMilestone(): Promise<NextMilestone> {
    return apiClient.get('/streaks/next');
  },

  async getUnviewedMilestones(): Promise<UserMilestone[]> {
    return apiClient.get('/streaks/unviewed');
  },

  async markMilestoneViewed(milestoneId: string): Promise<void> {
    await apiClient.put(`/streaks/milestones/${milestoneId}/view`);
  },

  async setMilestoneReward(milestoneId: string, reward: string): Promise<void> {
    await apiClient.put(`/streaks/milestones/${milestoneId}/reward`, { reward });
  },
};