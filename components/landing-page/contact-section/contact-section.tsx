'use client';

import { useState } from 'react';

import { ContactMailForm } from '@/components/forms/contact-mail-form/contact-mail-form';
import BoxReveal from '@/components/ui/box-reveal';
import { Typography } from '@/components/ui/typography';
import { ContactMailFormValue } from '@/schemas/contact-mail-schema';
import { SectionBlock } from '../section-block-wrapper';

const DEFAULT_DURATION = 0.5;
const DEFAULT_BOX_COLOR = '#5046e6';

// TODO: Use block of box reveals for each input instead for the whole form!
export const ContactSection = () => {
  const [isSendingMail, setIsSendingMail] = useState(false);

  const onSubmit = async (data: ContactMailFormValue) => {
    setIsSendingMail(true);
    console.log('data', data);
    setIsSendingMail(false);
  };

  return (
    <SectionBlock title='Get in touch' className='pb-12'>
      <div>
        <BoxReveal boxColor={DEFAULT_BOX_COLOR} duration={DEFAULT_DURATION}>
          <Typography variant='h4'>
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
        <div className='mx-auto flex w-1/2 items-center justify-center'>
          <BoxReveal width='100%' boxColor={DEFAULT_BOX_COLOR} duration={DEFAULT_DURATION}>
            <ContactMailForm onSubmit={onSubmit} isSendingMail={isSendingMail} />
          </BoxReveal>
        </div>
      </div>
    </SectionBlock>
  );
};
