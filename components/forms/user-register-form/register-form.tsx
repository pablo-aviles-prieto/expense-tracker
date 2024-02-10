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
import { DEFAULT_CALLBACK_URL } from "@/utils/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
      .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
      .regex(/[0-9]/, { message: "Password must include a number" })
      .regex(/[\W_]+/, { message: "Password must include a symbol" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords doesn't match",
    path: ["confirmPassword"],
  });

type UserFormValue = z.infer<typeof formSchema>;

type Props = {
  callbackUrl: string;
};

export const RegisterForm = ({ callbackUrl }: Props) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { trigger } = form;

  const onSubmit = async (data: UserFormValue) => {
    console.log("data", data);
    // signIn("user-pw", {
    //   email: data.email,
    //   password: data.password,
    //   callbackUrl: callbackUrl ?? DEFAULT_CALLBACK_URL,
    // });
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password..."
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm the password..."
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

        <Button disabled={loading} className="w-full ml-auto" type="submit">
          Register
        </Button>
      </form>
    </Form>
  );
};
