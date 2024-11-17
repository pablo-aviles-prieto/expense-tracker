'use client';

import React, { useMemo } from 'react';

import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table';
import { format, subYears } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFetch } from '@/hooks/use-fetch';
import type { Categories, Category, TransactionObjBack, TransactionsDateObj } from '@/types';
import { DEVICE_TYPE } from '@/types/device';
import {
  dateFormat,
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  getEllipsed,
  PAGE_SIZE_OPTIONS,
  URL_UPDATE_USER_TRANS_DATES,
} from '@/utils/const';
import { AmountCell } from '../amount-cell';
import { DateCell } from '../date-cell';
import { CellAction } from './cell-action';
import { FilterInputs } from './filter-inputs';

interface ParsedRow {
  original: TransactionObjBack;
}

interface DataTableProps<TData> {
  data: TData[];
  pageCount: number;
  userCategories: Categories[];
  pageSizeOptions?: number[];
  userStoredDates?: TransactionsDateObj | null;
  viewport: string | undefined;
}

export const TransactionsTable = <TData,>({
  data,
  pageCount,
  userCategories,
  userStoredDates = null,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  viewport,
}: DataTableProps<TData>) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const { fetchPetition } = useFetch();
  const { update: sessionUpdate } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Search params
  const page = searchParams?.get('page') ?? String(DEFAULT_PAGE);
  const pageAsNumber = Number(page);
  const fallbackPage = isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const perPage = searchParams?.get('limit') ?? String(DEFAULT_PAGE_LIMIT);
  const perPageAsNumber = Number(perPage);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage,
  });

  const columns: ColumnDef<TransactionObjBack>[] = useMemo(
    () => [
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
        accessorKey: 'amount',
        header: 'AMOUNT',
        cell: ({ getValue }) => <AmountCell textLeft amount={getValue() as string} />,
      },
      {
        accessorKey: 'date',
        header: 'DATE',
        cell: ({ getValue }) => <DateCell date={getValue() as string} />,
      },
      {
        accessorKey: 'categories',
        header: 'CATEGORIES',
        cell: ({ getValue }) => {
          const categories = getValue() as Category[];
          return (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`${getEllipsed} max-w-[100px] rounded-md bg-secondary px-[10px] py-[5px] text-sm font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring`}
                >
                  {categories.map(category => category.name).join(', ')}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm font-bold'>
                  {categories.map(category => category.name).join(', ')}
                </p>
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
          const selectedTransactions = (selectedRows as unknown as ParsedRow[]).map(
            row => row.original
          );
          return (
            <CellAction
              selectedTransactions={selectedTransactions}
              row={row}
              table={table}
              userCategories={userCategories}
            />
          );
        },
      },
    ],
    [userCategories]
  );

  const table = useReactTable({
    data,
    // @ts-expect-error column not correctly typed
    columns,
    pageCount: pageCount ?? -1,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true,
  });

  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: fallbackPage - 1 }));
  }, [fallbackPage]);

  React.useEffect(() => {
    const bothDatesExist = Boolean(date?.from && date.to);
    const formatedStartDate = bothDatesExist
      ? format(new Date(date!.from!), dateFormat.ISO)
      : undefined;
    const formatedEndDate = bothDatesExist
      ? format(new Date(date!.to!), dateFormat.ISO)
      : undefined;
    const dates = { startDate: formatedStartDate, endDate: formatedEndDate };

    // Avoiding unnecessary execution when the component is mounted the first time
    if (!bothDatesExist) return;

    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
        ...(bothDatesExist ? dates : {}),
      })}`,
      { scroll: false }
    );
    // refresh the page to get the correct dates from session/DB
    // Doing it in this useEffect to avoid a tiny flick of the data
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  React.useEffect(() => {
    const startDateParam = searchParams?.get('startDate');
    const endDateParam = searchParams?.get('endDate');

    if (startDateParam && endDateParam) {
      onSetDate(
        {
          from: new Date(startDateParam),
          to: new Date(endDateParam),
        },
        fallbackPage
      );
    } else if (userStoredDates) {
      onSetDate(
        {
          from: new Date(userStoredDates.from),
          to: new Date(userStoredDates.to),
        },
        fallbackPage
      );
    } else {
      onSetDate(
        {
          from: subYears(new Date(), 1),
          to: new Date(),
        },
        fallbackPage
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetDate = async (
    dateRange: DateRange | undefined,
    initPage?: number // receiving this param for when the component is first mounted
  ) => {
    setDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      const from = format(new Date(dateRange.from), dateFormat.ISO);
      const to = format(new Date(dateRange.to), dateFormat.ISO);

      // Need to push the query params and not rely on the change of page since
      // it can be the same page and not make a change at all
      router.push(
        `${pathname}?${createQueryString({
          page: initPage ?? DEFAULT_PAGE,
          limit: pageSize,
          startDate: from,
          endDate: to,
        })}`,
        { scroll: false }
      );
      await fetchPetition({
        url: URL_UPDATE_USER_TRANS_DATES,
        method: 'POST',
        body: { dates: { from, to } },
      });
      setPagination(prev => ({
        ...prev,
        pageIndex: initPage ? initPage - 1 : DEFAULT_PAGE - 1,
      }));
      await sessionUpdate({ transDates: { from, to } });
    }
  };

  return (
    <>
      <div className='overflow-x-auto pb-1'>
        <FilterInputs
          date={date}
          userCategories={userCategories}
          createQueryString={createQueryString}
          onSetDate={onSetDate}
          viewport={viewport}
        />
      </div>
      <ScrollArea className='h-[calc(80vh-240px)] rounded-md border'>
        <Table className='relative'>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      <div className='flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:!flex-row'>
        {viewport === DEVICE_TYPE.desktop && (
          <div className='flex w-full items-center justify-between'>
            <div className='flex-1 text-sm text-muted-foreground'>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
              <div className='flex items-center space-x-2'>
                <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={value => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className='h-8 w-[70px]'>
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side='top'>
                    {pageSizeOptions.map(pageSize => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        <div className='flex w-full items-center justify-between gap-2 sm:w-[calc(100%-300px)] sm:justify-end'>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              aria-label='Go to first page'
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to previous page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to next page'
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
            <Button
              aria-label='Go to last page'
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className='h-4 w-4' aria-hidden='true' />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
