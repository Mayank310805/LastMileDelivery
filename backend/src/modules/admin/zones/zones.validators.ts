import { z } from 'zod';

export const createZoneSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional()
});

export const updateZoneSchema = createZoneSchema.partial();
