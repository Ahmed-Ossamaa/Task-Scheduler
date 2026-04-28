import { cache } from 'react';
import { systemSettingsApi } from './system-settings.api';
import { SystemSettingsValues } from '@/lib/schema/system-settings-schema';

export const DEFAULT_SETTINGS: SystemSettingsValues = {
  appName: 'Schedio',
  contactEmail: 'support@schedio.com',
  contactPhone: '+20 155 458 0561',
  contactCityAddress: 'Alexandria, Egypt',
  contactStreetAddress: '23 Fawzy Moaz St., Smouha',
  logo: undefined,
  landingPageImage: undefined,
  banner: '',
  facebookUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  ticktokUrl: '',
};
/**
 *  Get the system settings from the database and cashe it - or use the default values
 */
export const getCachedSystemSettings = cache(async () => {
  try {
    const dbSettings = await systemSettingsApi.getSettings();

    // If the database is completely empty, return the defaults
    if (!dbSettings) return DEFAULT_SETTINGS;

    // Convert null values to undefined
    const sanitizedDbSettings = Object.fromEntries(
      Object.entries(dbSettings).map(([key, value]) => [
        key,
        value === null ? undefined : value, 
      ]),
    );

    // Filter out undefined and empty string"" then overwrite the defaults
    return {
      ...DEFAULT_SETTINGS,
      ...Object.fromEntries(
        Object.entries(sanitizedDbSettings).filter(
          ([_, v]) => v !== undefined && v !== '',
        ),
      ),
    } as SystemSettingsValues;
  } catch (error) {
    console.error(error, 'Failed to fetch settings, falling back to defaults');

    return DEFAULT_SETTINGS;
  }
});
