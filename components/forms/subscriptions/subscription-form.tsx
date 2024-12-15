'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { ClockLoader } from '@/components/icons/clock-loader';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CreateSubSchema, SubscriptionFormValue } from '@/schemas/create-subscription-schema';
import { BillingPeriod, SubscriptionStatus, type EnhancedSubscription } from '@/types';
import { dateFormat } from '@/utils/const';
import { formatEnumKey } from '@/utils/enum-operations';

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
    name: initData?.name ?? '',
    price: initData?.price ?? 0,
    startDate: initData?.startDate,
    billingPeriod: initData?.billingPeriod ?? BillingPeriod.Monthly,
    autoRenew: initData?.autoRenew ?? true,
    status: initData?.status ?? SubscriptionStatus.Active,
    notify: initData?.notify ?? false,
    notes: initData?.notes ?? '',
    _id: initData?._id ?? 'new sub',
  };

  const form = useForm<SubscriptionFormValue>({
    resolver: zodResolver(CreateSubSchema),
    defaultValues,
  });

  const { trigger } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className='w-full space-y-2 pl-1 pr-3'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Enter a name...'
                  disabled={loading}
                  {...field}
                  onChange={e => {
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
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='Enter a price...'
                  disabled={loading}
                  {...field}
                  onChange={e => {
                    const parsedValue = parseFloat(e.target.value);
                    field.onChange(isNaN(parsedValue) ? '' : parsedValue);
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
          name='startDate'
          render={({ field }) => {
            const parsedDateValue =
              typeof field.value === 'string' ? new Date(field.value) : field.value;
            return (
              <FormItem className='flex flex-col'>
                <FormLabel>Start date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 size-4' />
                        {field.value ? (
                          format(parsedDateValue, 'LLL dd, y')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={parsedDateValue}
                      onSelect={date => field.onChange(date ? format(date, dateFormat.ISO) : date)}
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
          name='billingPeriod'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a billing period' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(BillingPeriod).map(([key, value]) => (
                    <SelectItem key={key} className='hover:bg-accent' value={value}>
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
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select the status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(SubscriptionStatus).map(([key, value]) => (
                      <SelectItem key={key} className='hover:bg-accent' value={value}>
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
          name='notify'
          render={({ field }) => (
            <FormItem className='!mt-4 flex items-center gap-x-2 space-y-0'>
              <FormLabel>Notify me before pay day</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='autoRenew'
          render={({ field }) => (
            <FormItem className='!mt-4 flex items-center gap-x-2 space-y-0'>
              <FormLabel>Auto renew</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input
                  type='text'
                  placeholder='Notes...'
                  disabled={loading}
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    trigger(field.name);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex w-full items-center justify-end space-x-2 pt-6'>
          <Button type='button' disabled={loading} variant='outline' onClick={onCancel}>
            {cancelButtonContent || 'Cancel'}
          </Button>
          <Button type='submit' disabled={loading} variant='default'>
            {loading && <ClockLoader className='mr-2' />}
            {submitButtonContent || 'Update'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
