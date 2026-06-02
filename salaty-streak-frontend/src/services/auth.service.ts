import { apiClient } from '@/lib/api';
import { User } from '@/types/auth';

export const authService = {
  async updateProfile(data: Partial<Pick<User, 'name' | 'timezone' | 'latitude' | 'longitude'>>): Promise<User> {
    return apiClient.put<User>('/auth/profile', data);
  },
};