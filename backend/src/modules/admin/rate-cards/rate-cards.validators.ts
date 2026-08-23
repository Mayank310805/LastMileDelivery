import { z } from 'zod';

export const createRateCardSchema = z.object({
  orderType: z.enum(['B2B', 'B2C']),
  zoneRelation: z.enum(['INTRA', 'INTER']),
  basePrice: z.number().min(0),
  baseWeightKg: z.number().gt(0),
  additionalPricePerKg: z.number().min(0),
  minCharge: z.number().min(0)
});
