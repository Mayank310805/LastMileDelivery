import { z } from 'zod';

export const updateAvailabilitySchema = z.object({
  isAvailable: z.boolean()
});

export const updateLocationSchema = z.object({
  currentZoneId: z.string().min(1),
  currentLat: z.number().optional(),
  currentLng: z.number().optional()
});

export const createAgentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(6),
  currentZoneId: z.string().min(1)
});

export const updateStatusSchema = z.object({
  status: z.string(),
  remarks: z.string().optional(),
  failureReason: z.string().optional()
});
