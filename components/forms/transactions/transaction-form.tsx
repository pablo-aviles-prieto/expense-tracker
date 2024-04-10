"use client";

import { ClockLoader } from "@/components/icons/clock-loader";
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
import {
  TransactionFormValue,
  UpdateTransSchema,
} from "@/schemas/update-transactions-schema";
import type { Categories, TransactionObjBack } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { CategoriesComboboxField } from "../categories-combobox-field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { dateFormat } from "@/utils/const";

type Props = {
  loading: boolean;
  initData?: TransactionObjBack;
  submitHandler: (data: TransactionFormValue) => void;
  onCancel: () => void;
  userCategories: Categories[];
  submitButtonContent?: string;
  cancelButtonContent?: string;
};

export const TransactionForm = ({
  submitHandler,
  onCancel,
  loading,
  initData,
  userCategories,
  submitButtonContent,
  cancelButtonContent,
}: Props) => {
  const defaultValues = {
    name: initData?.name ?? "",
    amount: initData?.amount ?? 0,
    date: initData?.date,
    categories: initData?.categories ?? [],
    notes: initData?.notes ?? "",
    id: initData?.id ?? "new trans",
  };

  const form = useForm<TransactionFormValue>({
    resolver: zodResolver(UpdateTransSchema),
    defaultValues,
  });

  const { trigger } = form;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="w-full pl-1 pr-3 space-y-2"
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
                  placeholder="Enter a name..."
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
          name="date"
          render={({ field }) => {
            const parsedDateValue =
              typeof field.value === "string"
                ? new Date(field.value)
                : field.value;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal justify-start",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {field.value ? (
                          format(parsedDateValue, "LLL dd, y")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={parsedDateValue}
                      onSelect={(date) =>
                        field.onChange(
                          date ? format(date, dateFormat.ISO) : date,
                        )
                      }
                      defaultMonth={parsedDateValue}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormItem>
          <FormLabel>Categories</FormLabel>
          <FormControl>
            <Controller
              control={form.control}
              name="categories"
              render={({ field, fieldState: { error } }) => (
                <>
                  <CategoriesComboboxField
                    selectedCategories={field.value as Categories[]}
                    userCats={userCategories}
                    updateSelectedCategories={(selected) =>
                      field.onChange(selected)
                    }
                  />
                  {error && <FormMessage>{error.message}</FormMessage>}
                </>
              )}
            />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter an amount..."
                  disabled={loading}
                  {...field}
                  onChange={(e) => {
                    const parsedValue = parseFloat(e.target.value);
                    field.onChange(isNaN(parsedValue) ? "" : parsedValue);
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Notes..."
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

        <div className="flex items-center justify-end w-full pt-6 space-x-2">
          <Button
            type="button"
            disabled={loading}
            variant="outline"
            onClick={onCancel}
          >
            {cancelButtonContent || "Cancel"}
          </Button>
          <Button type="submit" disabled={loading} variant="default">
            {loading && <ClockLoader className="mr-2" />}
            {submitButtonContent || "Update"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
