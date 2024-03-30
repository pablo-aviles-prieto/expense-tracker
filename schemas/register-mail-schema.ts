import { z } from "zod";

export const RegisterMailSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export type RegisterMailFormValue = z.infer<typeof RegisterMailSchema>;
