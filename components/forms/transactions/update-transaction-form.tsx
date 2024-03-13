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

type Props = {
  loading: boolean;
  transData: TransactionObjBack;
  submitHandler: (data: TransactionFormValue) => void;
  onClose: () => void;
  userCategories: Categories[];
};

export const UpdateTransactionForm = ({
  submitHandler,
  onClose,
  loading,
  transData,
  userCategories,
}: Props) => {
  const defaultValues = {
    name: transData.name,
    amount: transData.amount,
    date: transData.date,
    categories: transData.categories,
    notes: transData.notes ?? "",
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter date..."
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
          <Button disabled={loading} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="default">
            {loading && <ClockLoader className="mr-2" />}Update
          </Button>
        </div>
      </form>
    </Form>
  );
};
