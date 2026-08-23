import { z } from 'zod';

export const createAreaSchema = z.object({
  name: z.string().min(1),
  pincode: z.string().regex(/^\d+$/),
  city: z.string().min(1),
  state: z.string().min(1),
  zoneId: z.string().min(1)
});

export const updateAreaSchema = createAreaSchema.partial();
