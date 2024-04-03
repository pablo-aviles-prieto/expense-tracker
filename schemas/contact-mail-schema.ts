import { z } from "zod";

export const ContactMailSchema = z.object({
  name: z.string().min(1, { message: "Name must be filled" }),
  contactMail: z.string().email({ message: "Enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject must be filled" }),
  message: z.string().min(1, { message: "Message must be filled" }),
});

export type ContactMailFormValue = z.infer<typeof ContactMailSchema>;
