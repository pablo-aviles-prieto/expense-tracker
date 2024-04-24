"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
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
import { UploadTransactionsModal } from "@/components/modal/transactions/upload-transactions-modal";
import type {
  TransactionBulk,
  TransactionBulkResponse,
  TransactionEndpointBody,
} from "@/types";
import { parseToBackendDate } from "@/utils/parse-to-backend-date";
import { parseAmount } from "@/utils/parse-amount";
import { useFetch } from "@/hooks/use-fetch";
import { URL_UPLOAD_BULK_TRANSACTION } from "@/utils/const";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
  const [open, setOpen] = useState(false);
  const [isUploadingTrans, setIsUploadingTrans] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const onUploadTrans = async () => {
    setIsUploadingTrans(true);
    const parsedTrans: TransactionEndpointBody[] = (
      data as TransactionBulk[]
    ).map((trans) => {
      const parsedBackendDate = parseToBackendDate({
        dateString: trans.Date,
        dateFormatFromCSV: CSVDateFormat,
      });
      return {
        name: trans.Concept,
        amount: parseAmount(trans.Amount),
        date: parsedBackendDate,
        notes: trans.Notes,
        selectedCategories:
          trans.selectedCategories && trans.selectedCategories.length > 0
            ? trans.selectedCategories
            : [
                {
                  id: process.env.GENERIC_ID ?? "",
                  name: "Generic",
                  common: true,
                },
              ],
      };
    });

    const res = await fetchPetition<TransactionBulkResponse>({
      url: URL_UPLOAD_BULK_TRANSACTION,
      method: "POST",
      body: { transactions: parsedTrans },
    });

    if (res.error) {
      toast({
        variant: "destructive",
        title: "Error uploading the transactions!",
        description: res.error,
      });
    }
    if (res.insertedTransactions && res.updatedUser) {
      toast({
        variant: "success",
        title: "Transactions uploaded correctly!",
        description: "The transactions has been uploaded!",
      });
      router.refresh();
      router.push(`/dashboard/transactions/list`);
    }
    setIsUploadingTrans(false);
  };

  return (
    <>
      <UploadTransactionsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onUploadTrans}
        loading={isUploadingTrans}
      />
      <div className="flex items-center justify-between my-2">
        <Button onClick={() => setCurrentStep(0)} variant="outline">
          <Undo className="w-4 h-4 mr-2" /> Go to previous step
        </Button>
        <Button onClick={() => setOpen(true)}>
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
    </>
  );
};
