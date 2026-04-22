import api from '@/lib/api/axios';
import { ContactFormValues } from '@/lib/schema/contact-form-schema';
import { ContactMessage, MessageStatus, PaginatedMessages } from '../types';
import { MsgQueryParams } from '../hooks/use-contact';


export const contactApi = {
  submitMessage: async (data: ContactFormValues) => {
    const response = await api.post<{ message: string }>('/contact-messages', data);
    return response.data;
  },


//..........Admin APIs..........

getMessages: async (params: MsgQueryParams) => {
    const res = await api.get<PaginatedMessages>('/contact-messages', { params });
    return res.data;
  },
  getArchived: async (page: number = 1, limit: number = 50) => {
    const res = await api.get<PaginatedMessages>('/contact-messages/archive', { params: { page, limit } });
    return res.data;
  },
  updateStatus: async (id: string, status: MessageStatus) => {
    const res = await api.patch<ContactMessage>(`/contact-messages/${id}/status`, { status });
    return res.data;
  },
  softDeleteMessage: async (id: string) => {
    const res = await api.delete<{ message: string }>(`/contact-messages/${id}`);
    return res.data;
  },
  restoreMessage: async (id: string) => {
    const res = await api.patch<{ message: string }>(`/contact-messages/${id}/restore`);
    return res.data;
  },
};