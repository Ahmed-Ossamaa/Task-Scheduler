import api from "@/lib/api/axios";


export const getPlatformAnalytics = async () => {
  const { data } = await api.get('/analytics/platform');
  return data;
};