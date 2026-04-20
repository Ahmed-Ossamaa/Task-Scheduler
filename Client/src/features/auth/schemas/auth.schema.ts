import { z } from "zod";


// Login
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Register
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(30, 'Name must be at most 30 characters'),
  email: z.email('Please enter a valid email address').nonempty('Email is required'),
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


//resend verification
export const resendVerificationSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .nonempty('Email is required'),
});


// forgot password
export const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address').nonempty('Email is required'),
});

// reset password
export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

// change password
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
});

export const changePasswordFormSchema = changePasswordSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const userBasicDataSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  gender: z.enum(['male', 'female']).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});



export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type verificationFormValues = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;
export type BasicDataValues = z.infer<typeof userBasicDataSchema>;