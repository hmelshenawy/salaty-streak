import { apiClient } from '@/lib/api';
import { PrayerLog, CreatePrayerLogDto, UpdatePrayerLogDto, QuickPrayerDto } from '@/types/prayer';

export const prayersService = {
  async create(data: CreatePrayerLogDto): Promise<PrayerLog> {
    return apiClient.post<PrayerLog>('/prayers', data);
  },

  async quickLog(data: QuickPrayerDto): Promise<PrayerLog & { autoStatus: string }> {
    return apiClient.post<PrayerLog & { autoStatus: string }>('/prayers/quick', data);
  },

  async getToday(): Promise<PrayerLog[]> {
    return apiClient.get<PrayerLog[]>('/prayers/today');
  },

  async getHistory(month?: string): Promise<PrayerLog[]> {
    const query = month ? `?month=${month}` : '';
    return apiClient.get<PrayerLog[]>(`/prayers/history${query}`);
  },

  async update(id: string, data: UpdatePrayerLogDto): Promise<PrayerLog> {
    return apiClient.put<PrayerLog>(`/prayers/${id}`, data);
  },

  async remove(id: string): Promise<void> {
    return apiClient.delete<void>(`/prayers/${id}`);
  },
};