import { useQuery } from "@tanstack/react-query";
import { getPlatformAnalytics } from "../api/analytics-api";

export const usePlatformAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: getPlatformAnalytics,
  });
};
