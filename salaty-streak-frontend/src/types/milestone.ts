export interface Milestone {
  id: string;
  title: string;
  targetDays: number;
  description: string | null;
  icon: string | null;
  completed: boolean;
  achievedAt: string | null;
  reward: string | null;
}

export interface NextMilestone {
  title: string;
  targetDays: number;
  remainingDays: number;
}

export interface UserMilestone {
  id: string;
  userId: string;
  milestoneId: string;
  reward: string | null;
  achievedAt: string;
  viewedAt: string | null;
  milestone: {
    id: string;
    title: string;
    targetDays: number;
    icon: string | null;
    description: string | null;
  };
}