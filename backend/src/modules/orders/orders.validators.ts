import { z } from 'zod';

const addressSchema = z.object({
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().regex(/^\d+$/)
});

export const quoteSchema = z.object({
  pickupAddress: addressSchema,
  dropAddress: addressSchema,
  lengthCm: z.number().gt(0),
  breadthCm: z.number().gt(0),
  heightCm: z.number().gt(0),
  actualWeightKg: z.number().gt(0),
  orderType: z.enum(['B2B', 'B2C']),
  paymentType: z.enum(['PREPAID', 'COD'])
});

export const createOrderSchema = quoteSchema.extend({
  customerId: z.string().optional()
});

export const rescheduleSchema = z.object({
  newScheduledDate: z.string().refine(val => !isNaN(Date.parse(val)) && new Date(val) > new Date(), { message: 'Must be a valid future date' })
});
