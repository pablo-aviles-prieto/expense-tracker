import { z } from "zod";

export const RegisterUserSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export type RegisterUserFormValue = z.infer<typeof RegisterUserSchema>;
