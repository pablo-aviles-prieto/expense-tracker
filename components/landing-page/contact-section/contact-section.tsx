'use client';

import { useState } from 'react';

import BoxReveal from '@/components/ui/box-reveal';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/use-toast';
import { useFetch } from '@/hooks/use-fetch';
import { ContactMailFormValue } from '@/schemas/contact-mail-schema';
import { URL_CONTACT_MAIL } from '@/utils/const';
import { SectionBlock } from '../section-block-wrapper';
import { ContactSectionForm } from './form-contact/contact-mail-form';

const DEFAULT_DURATION = 0.5;
const DEFAULT_BOX_COLOR = '#5046e6';

interface ContactMailResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export const ContactSection = () => {
  const [isSendingMail, setIsSendingMail] = useState(false);
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: ContactMailFormValue) => {
    const { update, id: toastId } = toast({
      title: 'Sending the email...',
      description: 'Please wait while the email is being sent',
      variant: 'default',
    });
    setIsSendingMail(true);

    const response = await fetchPetition<ContactMailResponse>({
      method: 'POST',
      url: URL_CONTACT_MAIL,
      body: { contact: data },
    });

    if (response.error) {
      update({
        id: toastId,
        title: 'Error sending the email',
        description: response.error,
        variant: 'destructive',
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: 'Email sent succesfully',
        description: response.message,
        variant: 'success',
      });
    }
    setIsSendingMail(false);
  };

  return (
    <SectionBlock title='Get in touch' className='pb-12'>
      <div className='mx-auto w-full lg:w-1/2'>
        <BoxReveal boxColor={DEFAULT_BOX_COLOR} duration={DEFAULT_DURATION}>
          <Typography className='text-balance md:text-center' variant='h4'>
            I’d love to hear from you! Whether you have a suggestion, found an issue, or just want
            to say hi, reach out via the contact form.{' '}
            <a
              href='https://github.com/pablo-aviles-prieto/expense-tracker/issues'
              target='_blank'
              rel='noopener noreferrer'
              className='text-indigo-500 underline'
            >
              Or open an issue in github
            </a>
          </Typography>
        </BoxReveal>
        <div className='mx-auto mt-6 flex w-full items-center justify-center'>
          <ContactSectionForm
            onSubmit={onSubmit}
            isSendingMail={isSendingMail}
            boxColor={DEFAULT_BOX_COLOR}
            boxDuration={DEFAULT_DURATION}
          />
        </div>
      </div>
    </SectionBlock>
  );
};
