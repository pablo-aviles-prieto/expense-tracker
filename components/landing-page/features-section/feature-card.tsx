'use client';

import { forwardRef } from 'react';

import { Icons } from '@/components/icons';
import { Typography } from '@/components/ui/typography';

export interface FeatureCardProps {
  title: string;
  description: string;
  iconType: keyof typeof Icons;
}

export const FeatureCard = forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ description, title, iconType }, ref) => {
    const Icon = Icons[iconType];

    return (
      <div
        ref={ref}
        className='rounded-lg border border-none bg-background text-card-foreground shadow-none'
      >
        <div className='space-y-4 p-6'>
          <header className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
            <Icon className='size-6 text-primary' />
          </header>
          <Typography variant='h3'>{title}</Typography>
          <Typography affects='muted' className='text-sm font-normal md:text-base'>
            {description}
          </Typography>
        </div>
      </div>
    );
  }
);

FeatureCard.displayName = 'FeatureCard';
