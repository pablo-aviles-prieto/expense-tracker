import { z } from "zod";

const CategorySchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  newEntry: z.boolean().optional(),
});

// Created this to avoid an error saying that expected number but received string
// when the number input is empty
const stringOrNumberAsNumber = z
  .union([z.string(), z.number()])
  .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
  .refine((val) => !isNaN(val), { message: "Amount must be a valid number" });

export const UpdateTransSchema = z.object({
  name: z.string().min(1, { message: "Name must be filled" }),
  amount: stringOrNumberAsNumber,
  date: z.string().min(1, { message: "Date must be filled" }),
  categories: z
    .array(CategorySchema)
    .min(1, { message: "At least one category is required" }),
  notes: z.string().optional(),
  id: z.string(),
});

export type TransactionFormValue = z.infer<typeof UpdateTransSchema>;
