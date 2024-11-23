'use client';

import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { TooltipProvider } from '@/components/ui/tooltip';
import { CurrencyProvider } from '@/contexts/currency-provider';
import { DateFormatProvider } from '@/contexts/date-format-provider';
import ThemeProvider from './ThemeToggle/theme-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 min
    },
  },
});

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps['session'];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const landingPageForcedTheme = pathname === '/landing' ? 'dark' : undefined;

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      forcedTheme={landingPageForcedTheme}
    >
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <DateFormatProvider>
            <CurrencyProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </CurrencyProvider>
          </DateFormatProvider>
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
