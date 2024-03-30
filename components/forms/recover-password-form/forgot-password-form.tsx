"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormValue,
} from "@/schemas/forgot-password-schema";
import { ClockLoader } from "@/components/icons/clock-loader";

const defaultValues = {
  email: "",
};

type Props = {
  onSubmit: (data: ForgotPasswordFormValue) => Promise<void>;
  isSendingMail: boolean;
};

export const ForgotPasswordForm = ({ onSubmit, isSendingMail }: Props) => {
  const form = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full !space-y-2 px-1"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email..."
                  disabled={isSendingMail}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSendingMail} className="w-full !mt-0" type="submit">
          {isSendingMail && <ClockLoader className="mr-2" />}
          {isSendingMail ? "Sending" : "Send"} recovery email
        </Button>
      </form>
    </Form>
  );
};
