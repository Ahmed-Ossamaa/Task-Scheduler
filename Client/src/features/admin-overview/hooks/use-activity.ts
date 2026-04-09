import { useQuery } from '@tanstack/react-query';
import { activityApi } from '../api/activity-api';

export const useActivityLogs = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['admin', 'activity', page, limit],
    queryFn: () => activityApi.getActivityLogs(page, limit),
    placeholderData: (previousData) => previousData, 
  });
};
