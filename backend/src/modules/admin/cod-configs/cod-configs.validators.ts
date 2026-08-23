import { z } from 'zod';

export const createCodConfigSchema = z.object({
  orderType: z.enum(['B2B', 'B2C']),
  surchargeType: z.enum(['FLAT', 'PERCENTAGE']),
  value: z.number().min(0),
  minCharge: z.number().min(0)
});
