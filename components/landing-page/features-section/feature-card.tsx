'use client';

import { useRef } from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Icons } from '@/components/icons';
import { Typography } from '@/components/ui/typography';

gsap.registerPlugin(ScrollTrigger);

export interface FeatureCardProps {
  title: string;
  description: string;
  iconType: keyof typeof Icons;
  delay?: number;
  index?: number;
}

export const FeatureCard = ({
  description,
  title,
  iconType,
  delay = 0,
  index = 0,
}: FeatureCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = Icons[iconType];

  useGSAP(() => {
    // In mobile, the animation will be triggered immediately and over the X axis
    // In desktop, the animation will be triggered with a delay and over the Y axis
    gsap.matchMedia().add(
      {
        // Condition created to trigger the animation if it has 300px or more
        isMobile: `(min-width: 300px)`,
        // Condition for screens 768px and up
        isDesktop: `(min-width: 768px)`,
      },
      context => {
        const isDesktop = context.conditions?.isDesktop;
        const appliedDelay = isDesktop ? delay : 0;
        const startXAxis = isDesktop ? 0 : 50 * (index % 2 === 0 ? 1 : -1);

        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: isDesktop ? 25 : 0, x: startXAxis },
          {
            delay: appliedDelay,
            opacity: 1,
            y: 0,
            x: 0,
            duration: 1,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 90%',
              once: true,
            },
          }
        );
      }
    );
  }, [cardRef, delay]);

  return (
    <div
      ref={cardRef}
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
};
