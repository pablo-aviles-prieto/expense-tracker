import { z } from "zod";
import { FIELDS_FROM_CSV } from "@/utils/const";

export const uploadCSVColumnsObject = {
  ...FIELDS_FROM_CSV.reduce(
    (acc, field) => {
      acc[field] = z.string({
        required_error: `Need to select an option to parse the ${field}`,
      });
      return acc;
    },
    {} as Record<string, z.ZodString>,
  ),
  DateFormat: z.string({
    required_error: "Need to select the date format on your CSV",
  }),
} as Record<string, z.ZodString>;

export const UploadCSVColumnsSchema = z.object(uploadCSVColumnsObject);
