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
import type { ResponseUser } from "@/types";
import { errorMessages } from "@/utils/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
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

const defaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const registerUrl = `api/user/register`;

type UserFormValue = z.infer<typeof formSchema>;

type Props = {
  callbackUrl: string;
};

export const RegisterForm = ({ callbackUrl }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { trigger } = form;

  const onSubmit = async (data: UserFormValue) => {
    const { update, id: toastId } = toast({
      title: "Signing up...",
      description: "Please wait while we create your account.",
      variant: "default",
    });
    setLoading(true);
    const displayRegisterErrorToast = (errorDescription: string) => {
      update({
        id: toastId,
        title: "Signup Failed",
        description: errorDescription,
        variant: "destructive",
      });
    };
    const parsedData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    try {
      const registerResponse = await fetchPetition<ResponseUser>({
        url: registerUrl,
        method: "POST",
        body: parsedData,
      });
      if (!registerResponse.ok) {
        displayRegisterErrorToast(
          registerResponse.error ?? errorMessages.generic,
        );
        setLoading(false);
        return;
      }

      const loginResponse = await signIn("user-pw", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (loginResponse?.ok && registerResponse.createdUser) {
        router.push(callbackUrl);
        update({
          id: toastId,
          title: "✅ Signup Successful",
          description: `Welcome ${registerResponse.createdUser.name}`,
          variant: "success",
        });
      } else {
        displayRegisterErrorToast(
          registerResponse.error ?? errorMessages.generic,
        );
      }
    } catch (err) {
      const errorString =
        err instanceof Error ? err.message : errorMessages.generic;
      displayRegisterErrorToast(errorString);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your name..."
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

        <Button
          disabled={loading}
          className="w-full !mt-4 ml-auto"
          type="submit"
        >
          Register
        </Button>
      </form>
    </Form>
  );
};
