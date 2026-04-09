import { useQuery } from '@tanstack/react-query';
import { errorLogsApi } from '../api/error-logs-api';

export const useSystemErrors = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ['admin', 'system-health', page, limit],
    queryFn: () => errorLogsApi.getSystemErrors(page, limit),
    refetchInterval: 60000,
  });
};
