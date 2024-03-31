import { availableCurrency, availableDateFormatTypes } from "@/utils/const";
import { z } from "zod";

const currencySymbols = Object.values(availableCurrency);
const dateFormatTypes = Object.values(availableDateFormatTypes);

export const UpdatePreferencesSchema = z.object({
  currency: z.enum(currencySymbols as [string, ...string[]]).optional(),
  dateFormat: z.enum(dateFormatTypes as [string, ...string[]]).optional(),
  theme: z.string().optional(),
});

export type UpdatePreferencesFormValue = z.infer<
  typeof UpdatePreferencesSchema
>;
