import api from '@/lib/api/axios';
import { ActivityLog, PaginatedResponse } from '../types';

export const activityApi = {
  getActivityLogs: async (page: number = 1, limit: number = 20) => {
    const { data } = await api.get<PaginatedResponse<ActivityLog>>(
      '/activity/logs',
      {
        params: { page, limit },
      },
    );
    return data;
  },

  /**
   * Deletes all activity logs (hard delete).
   */
  deleteActivityLogs: async (): Promise<void> => {
    await api.delete<void>('/activity/activity-logs');
   
  }
};
