import BoxReveal from '@/components/ui/box-reveal';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { SectionBlock } from '../section-block-wrapper';

export const ContactSection = () => {
  return (
    <SectionBlock title='Get in touch'>
      <div>
        <BoxReveal boxColor={'#5046e6'} duration={0.5}>
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
      </div>
    </SectionBlock>
  );
};
