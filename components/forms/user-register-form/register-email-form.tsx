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
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import type { ResponseRegisterMail } from "@/types";
import { URL_REGISTER_EMAIL } from "@/utils/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RegisterMailFormValue,
  RegisterMailSchema,
} from "@/schemas/register-mail-schema";

const defaultValues = {
  email: "",
};

export const RegisterEmailForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const form = useForm<RegisterMailFormValue>({
    resolver: zodResolver(RegisterMailSchema),
    defaultValues,
  });

  const { trigger } = form;

  const onSubmit = async (data: RegisterMailFormValue) => {
    const { update, id: toastId } = toast({
      title: "Creating...",
      description: "Please wait while we create the account",
      variant: "default",
    });
    setLoading(true);
    const response = await fetchPetition<ResponseRegisterMail>({
      url: URL_REGISTER_EMAIL,
      method: "POST",
      body: { email: data.email },
    });
    if (response.error) {
      update({
        id: toastId,
        title: "Error registering the email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: "Email registered succesfully",
        description: response.message,
        variant: "success",
      });
    }
    setLoading(false);
  };

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
                  disabled={loading}
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
          disabled={loading}
          className="w-full !mt-4 ml-auto"
          type="submit"
        >
          Register account
        </Button>
      </form>
    </Form>
  );
};
