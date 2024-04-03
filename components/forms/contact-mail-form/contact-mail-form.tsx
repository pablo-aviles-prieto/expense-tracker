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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShowPasswordBlock } from "../show-password-block";
import { cn } from "@/lib/utils";
import {
  ContactMailFormValue,
  ContactMailSchema,
} from "@/schemas/contact-mail-schema";
import { ClockLoader } from "@/components/icons/clock-loader";

const defaultValues = {
  name: "",
  subject: "",
  contactMail: "",
  message: "",
};

type Props = {
  onSubmit: (data: ContactMailFormValue) => Promise<void>;
  isSendingMail: boolean;
};

export const ContactMailForm = ({ onSubmit, isSendingMail }: Props) => {
  const form = useForm<ContactMailFormValue>({
    resolver: zodResolver(ContactMailSchema),
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  disabled={isSendingMail}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactMail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact email</FormLabel>
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
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter the subject..."
                  disabled={isSendingMail}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter the message..."
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
          {isSendingMail ? "Sending" : "Send"} mail
        </Button>
      </form>
    </Form>
  );
};
