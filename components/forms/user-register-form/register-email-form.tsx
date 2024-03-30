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
  RegisterMailFormValue,
  RegisterMailSchema,
} from "@/schemas/register-mail-schema";

const defaultValues = {
  email: "",
};

interface RegisterEmailFormProps {
  onSubmit: (data: RegisterMailFormValue) => Promise<void>;
  isLoading: boolean;
  buttonContent?: string;
}

export const RegisterEmailForm = ({
  onSubmit,
  isLoading,
  buttonContent = "Register account",
}: RegisterEmailFormProps) => {
  const form = useForm<RegisterMailFormValue>({
    resolver: zodResolver(RegisterMailSchema),
    defaultValues,
  });

  const { trigger } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
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
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    trigger(field.name);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={isLoading}
          className="w-full !mt-4 ml-auto"
          type="submit"
        >
          {buttonContent}
        </Button>
      </form>
    </Form>
  );
};
