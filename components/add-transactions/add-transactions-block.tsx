"use client";

import { useEffect, useState } from "react";
import type { FilePondInitialFile } from "filepond";
import {
  DATES_CSV_FORMAT_OPTIONS,
  URL_UPLOAD_TRANSACTION_FILE,
} from "@/utils/const";
import type { Categories, ResponseFile } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { AddTransactionsTable } from "../tables/add-transactions-tables/add-transaction-table";
import { columns } from "../tables/add-transactions-tables/columns";
import { ScrollArea } from "../ui/scroll-area";
import { useAddTransactionTable } from "@/hooks/use-add-transaction-table";
import { Separator } from "../ui/separator";
import { Stepper } from "./stepper";
import { InputFileBlock } from "./input-file-block";

type AddTransactionsBlockProps = {
  userCategories: Categories[];
};

export const AddTransactionsBlock = ({
  userCategories,
}: AddTransactionsBlockProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>(
    [],
  );
  const [CSVDateFormat, setCSVDateFormat] = useState<string>(
    DATES_CSV_FORMAT_OPTIONS[0],
  );
  const { addTransactions, setAddTransactions, setUserCategories } =
    useAddTransactionTable();

  useEffect(() => {
    setUserCategories(userCategories);
  }, [userCategories]);

  return (
    <>
      {/* <ScrollArea maxHeight={154} className="my-2"> */}
      <Stepper currentStep={currentStep} />
      <Separator />
      {currentStep === 0 && (
        <InputFileBlock files={files} setFiles={setFiles} />
      )}
      {/* </ScrollArea> */}

      {/* {addTransactions.length > 0 && (
        <div className="relative">
          <AddTransactionsTable
            columns={columns}
            data={addTransactions}
            dataLength={addTransactions.length}
          />
        </div>
      )} */}
    </>
  );
};
