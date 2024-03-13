"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./cell-action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEllipsed } from "@/utils/const";
import { DateCell } from "./date-cell";
import { AmountCell } from "../amount-cell";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  PAGE_SIZE_OPTIONS,
  URL_UPDATE_USER_TRANS_DATES,
  dateFormat,
} from "@/utils/const";
import { DateRange } from "react-day-picker";
import { format, subYears } from "date-fns";
import { useFetch } from "@/hooks/use-fetch";
import type {
  Categories,
  TransactionObjBack,
  TransactionsDateObj,
  Category,
} from "@/types";
import { useSession } from "next-auth/react";
import { FilterInputs } from "./filter-inputs";

interface ParsedRow {
  original: TransactionObjBack;
}

interface DataTableProps<TData, TValue> {
  data: TData[];
  pageCount: number;
  userCats: Categories[];
  pageSizeOptions?: number[];
  userStoredDates?: TransactionsDateObj | null;
}

export const TransactionsTable = <TData, TValue>({
  data,
  pageCount,
  userCats,
  userStoredDates = null,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: DataTableProps<TData, TValue>) => {
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [userCategories, setUserCategories] =
    React.useState<Categories[]>(userCats);
  const { fetchPetition } = useFetch();
  const { update: sessionUpdate } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Search params
  const page = searchParams?.get("page") ?? String(DEFAULT_PAGE);
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const perPage = searchParams?.get("limit") ?? String(DEFAULT_PAGE_LIMIT);
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
    [searchParams],
  );

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    });

  const columns: ColumnDef<TransactionObjBack>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "NAME",
      },
      {
        accessorKey: "amount",
        header: "AMOUNT",
        cell: ({ getValue }) => <AmountCell amount={getValue() as string} />,
      },
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ getValue }) => <DateCell date={getValue() as string} />,
      },
      {
        accessorKey: "categories",
        header: "CATEGORIES",
        cell: ({ getValue }) => {
          const categories = getValue() as Category[];
          return (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={`${getEllipsed} max-w-[100px] bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-[10px] py-[5px]
                  rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                  `}
                >
                  {categories.map((category) => category.name).join(", ")}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-bold">
                  {categories.map((category) => category.name).join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "notes",
        header: "NOTES",
      },
      {
        id: "actions",
        cell: ({ table, row }) => {
          const selectedRows = table.getFilteredSelectedRowModel().rows;
          const selectedTransactions = (
            selectedRows as unknown as ParsedRow[]
          ).map((row) => row.original);
          return (
            <CellAction
              selectedTransactions={selectedTransactions}
              row={row}
              table={table}
              userCategories={userCategories}
              setUserCategories={setUserCategories}
            />
          );
        },
      },
    ],
    [userCategories, setUserCategories],
  );

  const table = useReactTable({
    data,
    // @ts-ignore
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
    setPagination((prev) => ({ ...prev, pageIndex: fallbackPage - 1 }));
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
      { scroll: false },
    );
    // refresh the page to get the correct dates from session/DB
    // Doing it in this useEffect to avoid a tiny flick of the data
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  React.useEffect(() => {
    const startDateParam = searchParams?.get("startDate");
    const endDateParam = searchParams?.get("endDate");

    if (startDateParam && endDateParam) {
      onSetDate(
        {
          from: new Date(startDateParam),
          to: new Date(endDateParam),
        },
        fallbackPage,
      );
    } else if (userStoredDates) {
      onSetDate(
        {
          from: new Date(userStoredDates.from),
          to: new Date(userStoredDates.to),
        },
        fallbackPage,
      );
    } else {
      onSetDate(
        {
          from: subYears(new Date(), 1),
          to: new Date(),
        },
        fallbackPage,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetDate = async (
    dateRange: DateRange | undefined,
    initPage?: number, // receiving this param for when the component is first mounted
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
        { scroll: false },
      );
      await fetchPetition({
        url: URL_UPDATE_USER_TRANS_DATES,
        method: "POST",
        body: { dates: { from, to } },
      });
      setPagination((prev) => ({
        ...prev,
        pageIndex: initPage ? initPage - 1 : DEFAULT_PAGE - 1,
      }));
      await sessionUpdate({ transDates: { from, to } });
    }
  };

  return (
    <>
      <ScrollArea className="pb-3 overflow-y-hidden">
        <FilterInputs
          date={date}
          userCategories={userCategories}
          createQueryString={createQueryString}
          onSetDate={onSetDate}
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <ScrollArea className="rounded-md border h-[calc(80vh-240px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-col items-center justify-end gap-2 py-4 space-x-2 sm:!flex-row">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium whitespace-nowrap">
                Rows per page
              </p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full sm:w-[calc(100%-300px)] gap-2 sm:justify-end">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              aria-label="Go to first page"
              variant="outline"
              className="hidden w-8 h-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to previous page"
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to next page"
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
            <Button
              aria-label="Go to last page"
              variant="outline"
              className="hidden w-8 h-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
