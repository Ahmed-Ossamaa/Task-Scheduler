import api from '@/lib/api/axios';
import { GrowthInterval } from '../types';

export const analyticsApi = {
  /**
   * Retrieves platform analytics, including total users, organizations, projects, tasks, and role distribution.
   *
   * @returns A promise that resolves to an object containing platform analytics.
   */
  getPlatformAnalytics: async () => {
    const { data } = await api.get('/analytics/platform');
    return data;
  },

  /**
   * Retrieves the user growth over the given interval.
   *
   * @param {GrowthInterval} interval - The interval for which the user growth should be returned.
   * @returns A promise that resolves to an array of user growth objects, each containing the month and the number of users that joined during that month.
   */
  getUserGrowth: async (
    interval: GrowthInterval,
  ): Promise<{ month: Date; users: number }[]> => {
    const { data } = await api.get('/analytics/growth/user', {
      params: { interval },
    });
    return data.map((item: { month: string; users: number }) => ({
      month: new Date(item.month),
      users: item.users,
    }));
  },

};
