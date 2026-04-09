import api from "@/lib/api/axios";
import { ErrorLog, PaginatedResponse } from "../types";


export const errorLogsApi = {
  getSystemErrors: async (page: number = 1, limit: number = 5) => {
    const { data } = await api.get<PaginatedResponse<ErrorLog>>(
      '/activity/system-health',
      {
        params: { page, limit },
      },
    );
    return data;
  },
};
