"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FileUp, Undo } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  CSVDateFormat: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export const AddTransactionsTable = <TData, TValue>({
  columns,
  data,
  CSVDateFormat,
  setCurrentStep,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  console.log("data", data);

  // TODO: Add a button to save the transactions after the user added the categories
  // TODO: Add a tooltip with instructions of the format date dropdown and tell him
  // to add categories, if not, all the transactions without a specific category
  // gonna have a 'generic' category assigned!
  return (
    <div>
      <div className="flex items-center justify-between my-2">
        <Button onClick={() => setCurrentStep(0)} variant="outline">
          <Undo className="w-4 h-4 mr-2" /> Go to previous step
        </Button>
        <Button>
          <FileUp className="w-4 h-4 mr-2" /> Upload transactions
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-435px)] border rounded-md">
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
    </div>
  );
};
