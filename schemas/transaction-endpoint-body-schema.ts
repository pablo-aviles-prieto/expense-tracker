import { z } from "zod";

const CategorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  newEntry: z.boolean().optional(),
  common: z.boolean().optional(),
});

const TransactionEndpointBodySchema = z.object({
  name: z.string(),
  amount: z.number(),
  date: z.string(),
  selectedCategories: z.array(CategorySchema),
  notes: z.string().optional(),
});

export const TransactionsArraySchema = z.array(TransactionEndpointBodySchema);
