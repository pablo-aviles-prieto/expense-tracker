"use client";

import { useEffect, useState } from "react";
import type { FilePondInitialFile } from "filepond";
import { DATES_CSV_FORMAT_OPTIONS } from "@/utils/const";
import type { Categories } from "@/types";
import { AddTransactionsTable } from "../../tables/add-transactions-tables/add-transaction-table";
import { columns } from "../../tables/add-transactions-tables/columns";
import { ScrollArea } from "../../ui/scroll-area";
import { useAddTransactionTable } from "@/hooks/use-add-transaction-table";
import { Separator } from "../../ui/separator";
import { Stepper } from "./stepper";
import { InputFileBlock } from "./input-file-block";
import { CSVColumnsDropdown } from "./csv-columns-dropdown";

type AddTransactionsBulkBlockProps = {
  userCategories: Categories[];
};

export const AddTransactionsBulkBlock = ({
  userCategories,
}: AddTransactionsBulkBlockProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>(
    [],
  );
  const [CSVHeaders, setCSVHeaders] = useState<string[]>([]);
  const [CSVDateFormat, setCSVDateFormat] = useState<string>(
    DATES_CSV_FORMAT_OPTIONS[0],
  );
  const { addTransactions, setUserCategories } = useAddTransactionTable();

  useEffect(() => {
    setUserCategories(userCategories);
  }, [userCategories, setUserCategories]);

  return (
    <>
      <Stepper currentStep={currentStep} />
      <Separator />
      {currentStep === 0 && (
        <ScrollArea className="h-[calc(100vh-380px)]">
          <div className="px-3">
            <InputFileBlock
              files={files}
              setFiles={setFiles}
              setCSVHeaders={setCSVHeaders}
            />
            {CSVHeaders.length > 0 && (
              <CSVColumnsDropdown
                files={files}
                options={CSVHeaders}
                setCurrentStep={setCurrentStep}
                setCSVDateFormat={setCSVDateFormat}
              />
            )}
          </div>
        </ScrollArea>
      )}

      {addTransactions.length > 0 && currentStep === 1 && (
        <AddTransactionsTable
          columns={columns}
          data={addTransactions}
          CSVDateFormat={CSVDateFormat}
          setCurrentStep={setCurrentStep}
        />
      )}
    </>
  );
};
