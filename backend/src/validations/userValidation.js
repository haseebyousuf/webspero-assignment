import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .max(30, 'Name cannot be longer than 30 characters')
    .optional(),
  email: z
    .string()
    .email('Invalid email format')
    .min(3, 'Email must be at least 3 characters')
    .max(30, 'Email cannot be longer than 30 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  mobile: z.string().min(10, 'Invalid Phone number'),
  zipCode: z.string().regex(/^\d{6}$/, 'Invalid Zip Code'),
  profile: z.string().optional(),
  lat: z.number().optional(),
  lang: z.number().optional(),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
