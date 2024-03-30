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
import {
  DEFAULT_CALLBACK_URL,
  URL_REGISTER_USER,
  errorMessages,
} from "@/utils/const";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShowPasswordBlock } from "../show-password-block";
import {
  RegisterUserFormValue,
  RegisterUserSchema,
} from "@/schemas/register-user-schema";

type Props = {
  email: string;
};

export const RegisterUserForm = ({ email }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();
  const router = useRouter();

  const defaultValues = {
    name: "",
    email,
    password: "",
    confirmPassword: "",
  };

  const form = useForm<RegisterUserFormValue>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues,
  });

  const { trigger } = form;

  const onSubmit = async (data: RegisterUserFormValue) => {
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
        url: URL_REGISTER_USER,
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
        update({
          id: toastId,
          title: "✅ Signup Successful",
          description: `Welcome ${registerResponse.createdUser.name}`,
          variant: "success",
        });
        router.push(DEFAULT_CALLBACK_URL);
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
                    onChange={(e) => {
                      field.onChange(e);
                      trigger(field.name);
                    }}
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm the password..."
                    disabled={loading}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger(field.name);
                    }}
                  />
                  <ShowPasswordBlock
                    showPassword={showConfirmPassword}
                    onClick={() =>
                      setShowConfirmPassword((prevState) => !prevState)
                    }
                  />
                </div>
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
