import { cache } from 'react';
import { systemSettingsApi } from './system-settings.api';
import { SystemSettingsValues } from '@/lib/schema/system-settings-schema';

export const DEFAULT_SETTINGS: SystemSettingsValues = {
  appName: 'Schedio',
  contactEmail: 'support@schedio.com',
  contactPhone: '+20 155 458 0561',
  contactCityAddress: 'Alexandria, Egypt',
  contactStreetAddress: '23 Fawzy Moaz St., Smouha',
  logo: '',
  landingPageImage: '',
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

    // Convert null and empty string values to undefined
    const safeSettings = Object.fromEntries(
      Object.entries(dbSettings).map(([key, value]) => [
        key,
        value === null || value === '' ? undefined : value,
      ]),
    );

    // Merge the maped settings with the defaults
    return {
      ...DEFAULT_SETTINGS,
      ...safeSettings,
    };
  } catch (error) {
    console.error(error, 'Failed to fetch settings, falling back to defaults');

    return DEFAULT_SETTINGS;
  }
});
