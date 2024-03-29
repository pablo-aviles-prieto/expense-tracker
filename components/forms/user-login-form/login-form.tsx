"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
import type { CustomSessionI } from "@/types";
import { errorMessages } from "@/utils/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ShowPasswordBlock } from "../show-password-block";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string(),
});

const defaultValues = {
  email: "",
  password: "",
};

type UserFormValue = z.infer<typeof formSchema>;

type Props = {
  callbackUrl: string;
  setOpenForgotPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginForm = ({
  callbackUrl,
  setOpenForgotPasswordModal,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    const { update, id: toastId } = toast({
      title: "Signing in...",
      description: "Please wait while we verify the credentials.",
      variant: "default",
    });
    setLoading(true);
    const displayRegisterErrorToast = (errorDescription: string) => {
      update({
        id: toastId,
        title: "Signin Failed",
        description: errorDescription,
        variant: "destructive",
      });
    };
    try {
      const loginResponse = await signIn("user-pw", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (loginResponse?.ok) {
        const updatedSession = (await getSession()) as CustomSessionI | null;
        if (updatedSession?.user) {
          router.push(callbackUrl);
          update({
            id: toastId,
            title: "✅ Signin Successful",
            description: `Welcome back ${updatedSession.user.name}`,
            variant: "success",
          });
        }
      } else {
        displayRegisterErrorToast(errorMessages.credentials);
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                  <ShowPasswordBlock
                    showPassword={showPassword}
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p
          className={`!my-1 text-sm cursor-pointer !p-0 ${cn(
            buttonVariants({ variant: "link" }),
          )}`}
          onClick={() => setOpenForgotPasswordModal(true)}
        >
          Forgot your password? Recover it!
        </p>
        <Button disabled={loading} className="w-full !mt-0" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
};
