import { apiClient } from '@/lib/api';
import { DashboardResponse } from '@/types/dashboard';

export const dashboardService = {
  async getDashboard(): Promise<DashboardResponse> {
    return apiClient.get<DashboardResponse>('/dashboard');
  },
};