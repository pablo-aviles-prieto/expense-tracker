'use client';

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { Typography } from '../ui/typography';
import { SectionBlock } from './section-block-wrapper';

export const OpenSourceSection = () => {
  const anchorRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      anchorRef.current,
      { skewY: 0 }, // Initial skew
      {
        skewY: -1, // Final skew
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: anchorRef.current,
          start: 'top 60%',
          once: true,
          markers: true,
        },
      }
    );
  }, [anchorRef]);

  return (
    <SectionBlock title='open source code'>
      <div className='mx-auto w-full md:w-3/4 xl:w-3/5'>
        <Typography variant='h5' className='text-pretty'>
          The code is fully open-source, allowing complete transparency into how the app works
          behind the scenes. You’re welcome to explore the repository, make suggestions, and
          contribute through pull requests or issues. Let’s build a better tool together!
        </Typography>
        <div className='mx-4 rounded-lg bg-purple-950 md:mx-12'>
          <a
            href='https://github.com/pablo-aviles-prieto/expense-tracker'
            target='_blank'
            rel='noopener noreferrer'
            className='mt-8 block'
            ref={anchorRef}
          >
            <img
              className='w-full rounded-lg shadow-sm shadow-purple-300'
              src='/images/landing/repo.webp'
              alt='Expense tracker github repository'
            />
          </a>
        </div>
      </div>
    </SectionBlock>
  );
};
