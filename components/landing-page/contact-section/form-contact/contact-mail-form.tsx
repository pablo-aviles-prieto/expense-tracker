'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ClockLoader } from '@/components/icons/clock-loader';
import BoxReveal from '@/components/ui/box-reveal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactMailFormValue, ContactMailSchema } from '@/schemas/contact-mail-schema';

const defaultValues = {
  name: '',
  subject: '',
  contactMail: '',
  message: '',
};

type Props = {
  onSubmit: (data: ContactMailFormValue) => Promise<void>;
  isSendingMail: boolean;
  boxDuration: number;
  boxColor: string;
};

export const ContactSectionForm = ({ onSubmit, isSendingMail, boxDuration, boxColor }: Props) => {
  const form = useForm<ContactMailFormValue>({
    resolver: zodResolver(ContactMailSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ContactMailFormValue) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full space-y-2 px-1'>
        <BoxReveal width='100%' boxColor={boxColor} duration={boxDuration}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='!m-0.5'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter your name...'
                    disabled={isSendingMail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </BoxReveal>
        <BoxReveal width='100%' boxColor={boxColor} duration={boxDuration}>
          <FormField
            control={form.control}
            name='contactMail'
            render={({ field }) => (
              <FormItem className='!m-0.5'>
                <FormLabel>Contact email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email...'
                    disabled={isSendingMail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </BoxReveal>
        <BoxReveal width='100%' boxColor={boxColor} duration={boxDuration}>
          <FormField
            control={form.control}
            name='subject'
            render={({ field }) => (
              <FormItem className='!m-0.5'>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter the subject...'
                    disabled={isSendingMail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </BoxReveal>
        <BoxReveal width='100%' boxColor={boxColor} duration={boxDuration}>
          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem className='!m-0.5'>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter the message...'
                    disabled={isSendingMail}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </BoxReveal>
        <div className='!mt-6 w-full'>
          <BoxReveal width='100%' boxColor={boxColor} duration={boxDuration}>
            <Button disabled={isSendingMail} className='w-full' type='submit'>
              {isSendingMail && <ClockLoader className='mr-2' />}
              {isSendingMail ? 'Sending' : 'Send'} mail
            </Button>
          </BoxReveal>
        </div>
      </form>
    </Form>
  );
};
