import api from '@/lib/api/axios';
import { ContactFormValues } from '@/lib/schema/contact-form-schema';


export const contactApi = {
  submitMessage: async (data: ContactFormValues) => {
    const response = await api.post<{ message: string }>('/contact-messages', data);
    return response.data;
  },
};