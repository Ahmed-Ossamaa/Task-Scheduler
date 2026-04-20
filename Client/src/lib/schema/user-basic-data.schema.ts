import { z } from "zod";


export const userBasicDataSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }).max(30, 'Name must be at most 30 characters'),
  gender: z.enum(['male', 'female']).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});




export type BasicDataValues = z.infer<typeof userBasicDataSchema>;
