import React from 'react';

import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

import { cn } from '../../lib/utils';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-3xl font-semibold tracking-tight md:text-5xl',
      h2: 'text-2xl font-semibold tracking-tight first:mt-0 md:text-3xl',
      h3: 'text-xl font-semibold tracking-tight',
      h4: 'text-lg font-semibold tracking-tight',
      h5: 'font-medium tracking-tight',
      p: 'text-sm font-thin leading-5 first-letter:uppercase',
    },
    affects: {
      default: '',
      lead: 'text-xl font-normal',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      removePMargin: '[&:not(:first-child)]:mt-0',
    },
  },
  defaultVariants: {
    variant: 'p',
    affects: 'default',
  },
});

interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, variant, affects, ...props }, ref) => {
    const Comp = variant ?? 'p';
    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(typographyVariants({ variant, affects }), className)}
      />
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
