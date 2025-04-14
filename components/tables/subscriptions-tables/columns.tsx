'use client';

import { ColumnDef, Row, Table } from '@tanstack/react-table';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BillingPeriod, type EnhancedSubscription, type Subscription } from '@/types';
import { getEnumKeyByEnumValue } from '@/utils/enum-operations';
import { AmountCell } from '../amount-cell';
import { DateCell } from '../date-cell';
import { CellAction } from './cell-action';
import { NextBillingDateCell } from './next-billing-date-cell';
import { getAutoRenewInfo } from './utils/get-auto-renew-info';
import { getNotificationInfo } from './utils/get-notification-info';
import { getStatusInfo } from './utils/get-status-info';

interface ParsedRow {
  original: EnhancedSubscription;
}

export const columns: ColumnDef<Subscription>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'NAME',
  },
  {
    accessorKey: 'price',
    header: 'PRICE',
    cell: ({ getValue }) => <AmountCell textLeft amount={getValue() as string} />,
  },
  {
    accessorKey: 'startDate',
    header: 'START DATE',
    cell: ({ getValue }) => <DateCell center date={getValue() as string} />,
  },
  {
    accessorKey: 'nextBillingDate',
    header: 'NEXT BILLING DATE',
    cell: ({ row }) => (
      <NextBillingDateCell
        billingPeriod={row.original.billingPeriod}
        startDateStr={row.original.startDate}
      />
    ),
  },
  {
    accessorKey: 'billingPeriod',
    header: 'BILLING PERIOD',
    cell: ({ getValue }) => {
      const enumKey = getEnumKeyByEnumValue(BillingPeriod, getValue() as string);
      return (
        <div className='min-w-[110px] text-center lowercase first-letter:capitalize'>{enumKey}</div>
      );
    },
  },
  {
    accessorKey: 'autoRenew',
    header: 'AUTO RENEW',
    cell: ({ getValue }) => {
      const autoRenewInfo = getAutoRenewInfo(Boolean(getValue()));
      const Icon = Icons[autoRenewInfo?.icon ?? 'autoRenew'];
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className='flex min-w-[94px] items-center justify-center'>
              <Icon className={autoRenewInfo?.color} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm font-bold'>{autoRenewInfo?.text}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ getValue }) => {
      const statusInfo = getStatusInfo(String(getValue()));
      const Icon = Icons[statusInfo?.icon ?? 'active'];
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className='flex w-[50px] items-center justify-center'>
              <Icon className={statusInfo?.color} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm font-bold'>{statusInfo?.text}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    header: 'NOTIFY',
    accessorKey: 'notify',
    cell: ({ getValue }) => {
      const notificationInfo = getNotificationInfo(Boolean(getValue()));
      const Icon = Icons[notificationInfo?.icon ?? 'notifyOff'];
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className='flex min-w-[50px] items-center justify-center'>
              <Icon className={notificationInfo?.color} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className='text-sm font-bold'>{notificationInfo?.text}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: 'notes',
    header: 'NOTES',
  },
  {
    id: 'actions',
    cell: ({ table, row }) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedSubscriptions = (selectedRows as unknown as ParsedRow[]).map(
        row => row.original
      );

      // Not displaying the actions button in case there are selected rows and this row is not selected
      if (selectedRows.length > 0 && selectedRows.every(selectedRow => selectedRow.id !== row.id)) {
        return null;
      }

      return (
        <CellAction
          row={row as unknown as Row<EnhancedSubscription>}
          table={table as unknown as Table<EnhancedSubscription>}
          selectedSubscriptions={selectedSubscriptions}
        />
      );
    },
  },
];
