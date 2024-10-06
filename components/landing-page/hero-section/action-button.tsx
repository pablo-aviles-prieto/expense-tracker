import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import AnimatedGradientText from '@/components/ui/animated-gradient-text';
import { cn } from '@/lib/utils';

export async function ActionButton() {
  return (
    <Link href='/auth'>
      <AnimatedGradientText>
        <span
          className={cn(
            `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text px-2 py-1 text-transparent`
          )}
        >
          Start growing your wealth
        </span>
        <ChevronRight className='ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
      </AnimatedGradientText>
    </Link>
  );
}
