import { cn } from '@/lib/utils';
import { Typography } from '../ui/typography';

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionBlock = ({ className, title, children }: SectionBlockProps) => {
  return (
    <section className={cn('container space-y-8', className)}>
      <Typography variant='h1' className='text-center text-xl capitalize sm:text-2xl md:text-4xl'>
        {title}
      </Typography>
      {children}
    </section>
  );
};
