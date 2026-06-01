import { Test } from '@nestjs/testing';
import { StreaksService } from './streaks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('StreaksService', () => {
  let service: StreaksService;
  let prismaMock: {
    dailySummary: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      dailySummary: {
        findMany: jest.fn(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        StreaksService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  it('should return 0 streaks when no summaries exist', async () => {
    prismaMock.dailySummary.findMany.mockResolvedValue([]);
    const result = await service.calculateStreaks('user-1');
    expect(result).toEqual({ currentStreak: 0, bestStreak: 0 });
  });

  it('should calculate current streak from consecutive streak days', async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setUTCDate(dayBefore.getUTCDate() - 2);

    prismaMock.dailySummary.findMany.mockResolvedValue([
      { id: '1', userId: 'user-1', date: today, isStreakDay: true, totalPoints: 25, completedPrayers: 5, missedPrayers: 0 },
      { id: '2', userId: 'user-1', date: yesterday, isStreakDay: true, totalPoints: 25, completedPrayers: 5, missedPrayers: 0 },
      { id: '3', userId: 'user-1', date: dayBefore, isStreakDay: true, totalPoints: 25, completedPrayers: 5, missedPrayers: 0 },
    ]);

    const result = await service.calculateStreaks('user-1');
    expect(result.currentStreak).toBe(3);
    expect(result.bestStreak).toBe(3);
  });

  it('should reset current streak on non-streak day', async () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    prismaMock.dailySummary.findMany.mockResolvedValue([
      { id: '1', userId: 'user-1', date: today, isStreakDay: false, totalPoints: 10, completedPrayers: 4, missedPrayers: 1 },
      { id: '2', userId: 'user-1', date: yesterday, isStreakDay: true, totalPoints: 25, completedPrayers: 5, missedPrayers: 0 },
    ]);

    const result = await service.calculateStreaks('user-1');
    expect(result.currentStreak).toBe(0);
    expect(result.bestStreak).toBe(1);
  });
});