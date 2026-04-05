import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analytics-api";
import { GrowthInterval } from "../types";


export const usePlatformAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: analyticsApi.getPlatformAnalytics,
  });
  
};

export const useUserGrowth = (interval: GrowthInterval) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'user-growth', interval],
    queryFn: () => analyticsApi.getUserGrowth(interval),
  });
};

export const useOrgGrowth = (interval: GrowthInterval) => {
  return useQuery({
    queryKey: ['admin', 'analytics', 'org-growth', interval], 
    queryFn: () => analyticsApi.getOrgGrowth(interval),
  });
};
