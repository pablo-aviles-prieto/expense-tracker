import { z } from 'zod';

import { BillingPeriod, SubscriptionStatus } from '@/types';

export const CreateSubSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().min(1, { message: 'Price must be a non-negative number' }),
  startDate: z.string().min(1, { message: 'Start date be filled' }),
  billingPeriod: z
    .nativeEnum(BillingPeriod)
    .refine(val => Object.values(BillingPeriod).includes(val), {
      message: 'Need to select a billing period',
    }),
  autoRenew: z.boolean(),
  notify: z.boolean(),
  status: z
    .nativeEnum(SubscriptionStatus)
    .refine(val => Object.values(SubscriptionStatus).includes(val), {
      message: 'Need to select a status',
    }),
  notes: z.string().optional(),
  _id: z.string(),
});

export type SubscriptionFormValue = z.infer<typeof CreateSubSchema>;
