import { ContactFormValues } from '@/lib/schema/contact-form-schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../api/contact-api';
import { MessageStatus, MsgQueryParams } from '../types';

export const useSubmitMessage = () => {
  return useMutation({
    mutationFn: (data: ContactFormValues) => contactApi.submitMessage(data),
  });
};

// ...........Admin Hooks...........

export const useAdminMsgs = (params: MsgQueryParams) => {
  return useQuery({
    queryKey: ['contact-messages', 'admin-all', params],
    queryFn: () => contactApi.getMessages(params),
  });
};

export const useAdminArchivedMsgs = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['contact-messages', 'archived', page, limit],
    queryFn: () => contactApi.getArchived(page, limit),
  });
};

export const useUpdateMsgStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: MessageStatus }) => 
      contactApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages', 'admin-all'] });
    },
  });
};

export const useArchiveMsg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.softDeleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages', 'admin-all'] });
      queryClient.invalidateQueries({ queryKey: ['contact-messages', 'archived'] });
    },
  });
};

export const useRestoreMsg = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contactApi.restoreMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages', 'admin-all'] });
      queryClient.invalidateQueries({ queryKey: ['contact-messages', 'archived'] });
    },
  });
};
