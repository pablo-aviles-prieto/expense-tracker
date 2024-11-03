import { Typography } from '@/components/ui/typography';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const FeatureCard = ({ description, title, icon }: FeatureCardProps) => {
  return (
    <div className='rounded-lg border border-none bg-background text-card-foreground shadow-none'>
      <div className='space-y-4 p-6'>
        <header className='flex size-12 items-center justify-center rounded-full bg-primary/10'>
          {icon}
        </header>
        <Typography variant='h3'>{title}</Typography>
        <Typography affects='muted' className='text-sm font-normal md:text-base'>
          {description}
        </Typography>
      </div>
    </div>
  );
};
