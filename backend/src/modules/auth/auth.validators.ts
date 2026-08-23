import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d).*$/, 'Password must contain at least 1 letter and 1 number')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
