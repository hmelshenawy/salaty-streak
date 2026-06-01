export class TodayPrayerDto {
  prayerName!: string;
  status!: string | null;
  inMosque!: boolean;
  points!: number;
  prayedAt!: Date | null;
}

export class DashboardResponseDto {
  currentStreak!: number;
  bestStreak!: number;
  monthlyPoints!: number;
  completionRate!: number;
  todayPrayers!: TodayPrayerDto[];
}