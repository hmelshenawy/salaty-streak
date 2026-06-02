export type PrayerName = 'FAJR' | 'DHUHR' | 'ASR' | 'MAGHRIB' | 'ISHA';
export type PrayerStatus = 'ON_TIME' | 'LATE' | 'MISSED';

export interface PrayerLog {
  id: string;
  userId: string;
  prayerName: PrayerName;
  date: string;
  status: PrayerStatus;
  prayedAt: string | null;
  inMosque: boolean;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrayerLogDto {
  prayerName: PrayerName;
  status: PrayerStatus;
  date: string;
  inMosque?: boolean;
  prayedAt?: string;
}

export interface QuickPrayerDto {
  prayerName: PrayerName;
  date: string;
  inMosque?: boolean;
}

export interface UpdatePrayerLogDto {
  status?: PrayerStatus;
  inMosque?: boolean;
  prayedAt?: string;
}