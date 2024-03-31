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
  ChangeNameFormValue,
  ChangeNameSchema,
} from "@/schemas/change-name-schema";

const defaultValues = {
  name: "",
};

interface RegisterEmailFormProps {
  onSubmit: (data: ChangeNameFormValue) => Promise<void>;
  isLoading: boolean;
}

export const ChangeNameForm = ({
  onSubmit,
  isLoading,
}: RegisterEmailFormProps) => {
  const form = useForm<ChangeNameFormValue>({
    resolver: zodResolver(ChangeNameSchema),
    defaultValues,
  });

  const { trigger } = form;

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
          Change name
        </Button>
      </form>
    </Form>
  );
};
