"use client";

import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DateFormatProvider } from "@/contexts/date-format-provider";
import { CurrencyProvider } from "@/contexts/currency-provider";

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
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
    </>
  );
}
