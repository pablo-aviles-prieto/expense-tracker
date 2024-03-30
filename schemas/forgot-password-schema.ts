import { z } from "zod";

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export type ForgotPasswordFormValue = z.infer<typeof ForgotPasswordFormSchema>;
