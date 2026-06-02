import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StreaksService } from '../streaks/streaks.service';

@Injectable()
export class MilestonesService {
  constructor(
    private prisma: PrismaService,
    private streaksService: StreaksService,
  ) {}

  /**
   * Check if any new milestones have been reached after a prayer mutation.
   * Creates UserMilestone records for any newly eligible milestones.
   * Returns the list of newly-achieved milestones (empty if none).
   */
  async checkMilestones(userId: string) {
    const { currentStreak } = await this.streaksService.calculateStreaks(userId);

    const eligibleMilestones = await this.prisma.milestone.findMany({
      where: { targetDays: { lte: currentStreak } },
    });

    const newlyAchieved: { id: string; title: string; targetDays: number; icon: string | null }[] = [];

    for (const milestone of eligibleMilestones) {
      const existing = await this.prisma.userMilestone.findUnique({
        where: { userId_milestoneId: { userId, milestoneId: milestone.id } },
      });

      if (!existing) {
        await this.prisma.userMilestone.create({
          data: { userId, milestoneId: milestone.id },
        });
        newlyAchieved.push({
          id: milestone.id,
          title: milestone.title,
          targetDays: milestone.targetDays,
          icon: milestone.icon,
        });
      }
    }

    return newlyAchieved;
  }

  /**
   * Get all milestones with the user's achievement status.
   */
  async getMilestones(userId: string) {
    const milestones = await this.prisma.milestone.findMany({
      orderBy: { targetDays: 'asc' },
    });

    const userMilestones = await this.prisma.userMilestone.findMany({
      where: { userId },
    });

    const userMilestoneMap = new Map(userMilestones.map((um) => [um.milestoneId, um]));

    return milestones.map((milestone) => {
      const userMilestone = userMilestoneMap.get(milestone.id);
      return {
        id: milestone.id,
        title: milestone.title,
        targetDays: milestone.targetDays,
        description: milestone.description,
        icon: milestone.icon,
        completed: !!userMilestone,
        achievedAt: userMilestone?.achievedAt?.toISOString() ?? null,
        reward: userMilestone?.reward ?? null,
      };
    });
  }

  /**
   * Get the next milestone the user is working toward.
   */
  async getNextMilestone(userId: string) {
    const { currentStreak } = await this.streaksService.calculateStreaks(userId);

    const nextMilestone = await this.prisma.milestone.findFirst({
      where: { targetDays: { gt: currentStreak } },
      orderBy: { targetDays: 'asc' },
    });

    if (!nextMilestone) {
      // All milestones achieved — return the highest one
      const highest = await this.prisma.milestone.findFirst({
        orderBy: { targetDays: 'desc' },
      });
      return {
        title: highest?.title ?? 'Full Year Achievement',
        targetDays: highest?.targetDays ?? 365,
        remainingDays: 0,
      };
    }

    return {
      title: nextMilestone.title,
      targetDays: nextMilestone.targetDays,
      remainingDays: nextMilestone.targetDays - currentStreak,
    };
  }

  /**
   * Get unviewed milestone achievements (for celebration popups).
   */
  async getUnviewedMilestones(userId: string) {
    return this.prisma.userMilestone.findMany({
      where: { userId, viewedAt: null },
      include: {
        milestone: { select: { id: true, title: true, targetDays: true, icon: true, description: true } },
      },
      orderBy: { achievedAt: 'asc' },
    });
  }

  /**
   * Mark a milestone achievement as viewed.
   */
  async markViewed(userId: string, milestoneId: string) {
    return this.prisma.userMilestone.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: { viewedAt: new Date() },
    });
  }

  /**
   * Set a reward on an achieved milestone.
   */
  async setReward(userId: string, milestoneId: string, reward: string) {
    return this.prisma.userMilestone.update({
      where: { userId_milestoneId: { userId, milestoneId } },
      data: { reward },
    });
  }
}