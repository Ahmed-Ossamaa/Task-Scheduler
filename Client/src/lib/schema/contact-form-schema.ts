import { z } from "zod";


export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters'),
  email: z.email('Please enter a valid email address'),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(50, 'Subject must be at most 50 characters'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message must be at most 500 characters'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;