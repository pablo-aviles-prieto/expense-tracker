import { z } from "zod";

export const ChangeNameSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export type ChangeNameFormValue = z.infer<typeof ChangeNameSchema>;
