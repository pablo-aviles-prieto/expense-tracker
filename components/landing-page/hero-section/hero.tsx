import { GSAPFadeInContainer } from '@/components/containers/gsap-fade-in-container';
import WordFadeIn from '@/components/ui/word-fade-in';
import { cn } from '@/lib/utils';
import { Typography } from '../../ui/typography';
import { ActionButton } from './action-button';

const SCROLL_DOWN_TEXT = 'Discover how we simplify managing your finances';

export const HeroSection = () => {
  return (
    <div className='mx-auto max-w-5xl text-balance text-center'>
      <Typography className='font-rifton text-xl sm:text-3xl md:text-4xl xl:text-5xl'>
        Manage your transactions and subscriptions with ease
      </Typography>
      <Typography variant='h5' className='mx-auto mb-14 mt-6 font-normal text-gray-400'>
        Track your incomes, expenses and subscriptions all in one place
      </Typography>
      <ActionButton />
      {/* <WordFadeIn
        className='mx-auto my-14 mt-28 text-base font-normal tracking-tight text-gray-400 dark:text-gray-400 md:mt-14 md:text-base'
        words='Discover how we simplify managing your finances'
      /> */}
      <div className='mx-auto my-14 mt-28 text-base font-normal tracking-tight text-gray-400 md:mt-14'>
        <GSAPFadeInContainer delayStep={0.2} disableMobileAnimations>
          {SCROLL_DOWN_TEXT.split(' ').map((word, index) => (
            <span
              key={index}
              className={cn('mr-2 inline-block', index === SCROLL_DOWN_TEXT.length - 1 && 'mr-0')}
            >
              {word}
            </span>
          ))}
        </GSAPFadeInContainer>
      </div>
    </div>
  );
};
