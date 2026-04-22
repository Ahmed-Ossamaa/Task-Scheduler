import { ContactFormValues } from '@/lib/schema/contact-form-schema';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '../contact-api';


export const useSubmitMessage = () => {
  return useMutation({
    mutationFn: (data: ContactFormValues) => contactApi.submitMessage(data),
  });
};
