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
  BillingPeriod,
  SubscriptionStatus,
  type EnhancedSubscription,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  CreateSubSchema,
  SubscriptionFormValue,
} from "@/schemas/create-subscription-schema";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatEnumKey } from "@/utils/enum-operations";

type Props = {
  loading: boolean;
  initData?: EnhancedSubscription;
  submitHandler: (data: SubscriptionFormValue) => void;
  onCancel: () => void;
  submitButtonContent?: string;
  cancelButtonContent?: string;
};

export const SubscriptionForm = ({
  submitHandler,
  onCancel,
  loading,
  initData,
  submitButtonContent,
  cancelButtonContent,
}: Props) => {
  const defaultValues = {
    name: initData?.name ?? "",
    price: initData?.price ?? 0,
    startDate: initData?.startDate,
    billingPeriod: initData?.billingPeriod ?? BillingPeriod.Monthly,
    autoRenew: initData?.autoRenew ?? true,
    status: initData?.status ?? SubscriptionStatus.Active,
    notes: initData?.notes ?? "",
    _id: initData?._id ?? "new sub",
  };

  const form = useForm<SubscriptionFormValue>({
    resolver: zodResolver(CreateSubSchema),
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
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter a price..."
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
          name="startDate"
          render={({ field }) => {
            const parsedDateValue =
              typeof field.value === "string"
                ? new Date(field.value)
                : field.value;
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Start date</FormLabel>
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
        <FormField
          control={form.control}
          name="billingPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a billing period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(BillingPeriod).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      className="hover:bg-accent"
                      value={value}
                    >
                      {formatEnumKey(key)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(SubscriptionStatus).map(([key, value]) => (
                      <SelectItem
                        key={key}
                        className="hover:bg-accent"
                        value={value}
                      >
                        {formatEnumKey(key)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="autoRenew"
          render={({ field }) => (
            <FormItem className="flex items-center gap-x-2">
              <FormLabel>Auto renew</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
