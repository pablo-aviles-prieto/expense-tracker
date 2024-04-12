"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdatePreferencesFormValue,
  UpdatePreferencesSchema,
} from "@/schemas/update-preferences-schema";
import { type DropdownData } from "@/components/profile-block/change-preferences-block";

interface ChangeUserPreferencesFormProps {
  dropdownsData: DropdownData[];
  isLoading: boolean;
  onSubmit: (data: UpdatePreferencesFormValue) => Promise<void>;
  defaultValues: {
    theme: string | undefined;
    dateFormat: string | undefined;
    currency: string | undefined;
  };
}

export const ChangeUserPreferencesForm = ({
  dropdownsData,
  onSubmit,
  isLoading,
  defaultValues,
}: ChangeUserPreferencesFormProps) => {
  const form = useForm<UpdatePreferencesFormValue>({
    resolver: zodResolver(UpdatePreferencesSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="items-center justify-center w-full space-y-2 xl:space-y-0 xl:flex gap-x-2">
          {dropdownsData.map((dropdown) => (
            <FormField
              key={dropdown.key}
              control={form.control}
              name={dropdown.key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dropdown.label}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full xl:w-[265px]">
                        <SelectValue placeholder={dropdown.placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dropdown.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="w-full text-center">
          <Button
            disabled={isLoading}
            className="w-full xl:max-w-xs !mt-4"
            type="submit"
          >
            Change preferences
          </Button>
        </div>
      </form>
    </Form>
  );
};
