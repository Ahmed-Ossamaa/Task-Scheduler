import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { systemSettingsApi } from '../api/system-settings.api';
import { useRouter } from 'next/navigation';

export const useGetSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: systemSettingsApi.getSettings,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: systemSettingsApi.updateSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      router.refresh();
    },
  });
};

export const useRestoreSystemSettings = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: systemSettingsApi.restoreDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      router.refresh();
    },
  });
};

export const useUploadLogo = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: systemSettingsApi.uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      router.refresh();
    },
  });
};

export const useUploadLandingImage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: systemSettingsApi.uploadLandingImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      router.refresh();
    },
  });
};
