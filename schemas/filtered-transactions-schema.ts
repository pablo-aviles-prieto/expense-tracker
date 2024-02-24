import { z } from "zod";

const TransTypeEnum = z.enum(["incomes", "expenses"]);
const FilterTypeEnum = z.enum(["Amount", "Name"]);
const FilterOperatorEnum = z.enum(["gt", "lt"]);

export const FilteredTransactionsSchema = z.object({
  userId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  transType: TransTypeEnum.nullable(),
  filterType: FilterTypeEnum.nullable(),
  filterOperator: FilterOperatorEnum.nullable(),
  filterValue: z.string().nullable(),
  filteredCategories: z.array(z.string()).optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});
