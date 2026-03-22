import { z } from "zod";


// Login
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;


// Register
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name must be at most 30 characters'),
  email: z.email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;