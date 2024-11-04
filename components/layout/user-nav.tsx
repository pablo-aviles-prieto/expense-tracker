'use client';

import { useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrency } from '@/hooks/use-currency';
import { useDateFormat } from '@/hooks/use-date-format';
import { Icons } from '../icons';
import { ContactMailModal } from '../modal/contact/contact-mail-modal';

export function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { dateFormat, availableDateFormatTypes, changeDateFormat } = useDateFormat();
  const { currency, changeCurrency, availableCurrency } = useCurrency();
  const router = useRouter();

  if (session) {
    return (
      <>
        <ContactMailModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative size-8 rounded-full'>
              <Avatar className='size-8'>
                <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
                <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{session.user?.name}</p>
                <p className='text-xs leading-none text-muted-foreground'>{session.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                Profile
                <DropdownMenuShortcut>
                  <Icons.profile className='size-4' />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOpen(true)}>
                Contact
                <DropdownMenuShortcut>
                  <Icons.mail className='size-4' />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Date Format</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {Object.entries(availableDateFormatTypes).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        onClick={() => changeDateFormat(value)}
                        checked={dateFormat === value}
                      >
                        <p>
                          {key} <span className='text-xs'>({value})</span>
                        </p>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Currency</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {Object.entries(availableCurrency).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        onClick={() => changeCurrency(value)}
                        checked={currency === value}
                      >
                        <p>
                          {key} <span className='text-xs'>({value})</span>
                        </p>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
              <DropdownMenuShortcut>
                <Icons.logout className='size-4' />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  }
}
