import api from "@/lib/api/axios";
import { SystemSettingsValues } from "@/lib/schema/system-settings-schema";


export const systemSettingsApi = {

  /**
   * Get current system settings (public)
   */
  getSettings: async () => {
    const { data } = await api.get('/system-settings');
    return data;
  },


  /**
   * Update system settings (admin)
   */
  updateSettings: async (payload: SystemSettingsValues) => {
    const { data } = await api.patch('/system-settings', payload);
    return data;
  },

  /**
   * Restore system default settings (admin)
   */
  restoreDefaults: async () => {
    const { data } = await api.post('/system-settings/restore-defaults');
    return data;
  },

  /**
   * Upload/update system logo (admin)
   */
uploadLogo: async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file); 

    const { data } = await api.patch('/system-settings/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; 
  },

  /**
   * Upload/update landing page image (admin)
   */
  uploadLandingImage: async (file: File) => {
    const formData = new FormData();
    formData.append('landing', file); 

    const { data } = await api.patch('/system-settings/landing', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; 
  },
};
