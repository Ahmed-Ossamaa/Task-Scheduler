import * as z from 'zod';


export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(50, 'Project name must be at most 50 characters'),
  description: z
    .string()
    .max(300, 'Description must be at most 300 characters')
    .optional(),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;