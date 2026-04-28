import { z } from 'zod';

export const systemSettingsSchema = z.object({
  appName: z.string().optional(),
  contactEmail: z.email('Please enter a valid email address').optional(),
  contactPhone: z
    .string()
    .max(20, 'Phone number must be at most 20 characters')
    .optional(),
  contactCityAddress: z.string().optional(),
  contactStreetAddress: z.string().optional(),
  logo: z.custom<File | string>().optional(),
  landingPageImage: z.custom<File | string>().optional(),
  banner: z.string().optional(),
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  ticktokUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export type SystemSettingsValues = z.infer<typeof systemSettingsSchema>;
