import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().max(50).optional(),
  email: z.string().email().min(3).max(30),
  password: z.string().min(6),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  zipCode: z.string(),
  profile: z.string().optional(),
  lat: z.number().optional(),
  lang: z.number().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
