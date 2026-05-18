import z from "zod";

export const orgProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  industry: z.string().max(50).optional().or(z.literal('')),
  slogan: z.string().max(100).optional().or(z.literal('')),
  websiteUrl: z
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  contactEmail: z
    .email('Must be a valid email')
    .optional()
    .or(z.literal('')),
});

export type OrgProfileFormValues = z.infer<typeof orgProfileSchema>;