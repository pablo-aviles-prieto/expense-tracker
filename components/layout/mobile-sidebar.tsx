'use client';

import { useState } from 'react';

import { MenuIcon } from 'lucide-react';

import { DashboardNav } from '@/components/layout/dashboard-nav';
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { navItems } from '@/utils/const';

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side='left' className='!px-0'>
          <SheetDescription className='sr-only'>Mobile side drawer</SheetDescription>
          <div className='space-y-4 py-4'>
            <div className='px-3 py-2'>
              <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>Overview</h2>
              <div className='space-y-1'>
                <DashboardNav items={navItems} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
