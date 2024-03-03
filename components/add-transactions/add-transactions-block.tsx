"use client";

import { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import type { FilePondFile, FilePondInitialFile } from "filepond";
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

type AddTransactionsBlockProps = {
  userCategories: Categories[];
};

export const AddTransactionsBlock = ({
  userCategories,
}: AddTransactionsBlockProps) => {
  const [files, setFiles] = useState<Array<FilePondInitialFile | File | Blob>>(
    [],
  );
  const [CSVDateFormat, setCSVDateFormat] = useState<string>(
    DATES_CSV_FORMAT_OPTIONS[0],
  );
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { addTransactions, setAddTransactions, setUserCategories } =
    useAddTransactionTable();

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    setUserCategories(userCategories);
  }, [userCategories]);

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const updatedFiles: Array<FilePondInitialFile | File | Blob> =
      fileItems.map((fileItem) => fileItem.file);
    setFiles(updatedFiles);
  };

  const handleFileProcessed = (response: any) => {
    const { ok: responseOk, data }: ResponseFile = JSON.parse(response);
    if (responseOk && data) {
      const parsedTrans = data.map((trans, i) => ({ ...trans, id: i }));
      setAddTransactions((prevState) => [...prevState, ...parsedTrans]);
      return "success";
    }
    return "failure";
  };

  return (
    <>
      <ScrollArea maxHeight={154} className="my-2">
        <div
          className="file-wrapper max-w-[400px] mx-auto -mb-4"
          style={isReady ? { opacity: 1 } : undefined}
        >
          <FilePond
            files={files}
            allowMultiple
            maxFiles={3}
            maxParallelUploads={1}
            onupdatefiles={handleUpdateFiles}
            credits={false}
            labelIdle='Drag & Drop your CSV files or <span class="filepond--label-action"> Browse </span>'
            labelFileProcessing="Parsing"
            labelFileProcessingComplete="Parse completed"
            labelTapToCancel="Please wait..."
            name="files"
            server={{
              process: {
                url: URL_UPLOAD_TRANSACTION_FILE,
                method: "POST",
                withCredentials: false,
                onload: handleFileProcessed,
                onerror: (response) => {
                  try {
                    const parsedRes = JSON.parse(response);
                    toast({
                      title: "There was an error uploading the file",
                      description: parsedRes.error,
                      variant: "destructive",
                    });
                  } catch (error) {
                    // Meaning its not an object stringified
                    console.log("ERROR UPLOADING THE CSV:", response);
                    toast({
                      title: "There was an error uploading the file",
                      description: `Please, contact to support or try again later`,
                      variant: "destructive",
                    });
                  }
                },
              },
            }}
          />
        </div>
      </ScrollArea>
      {addTransactions.length > 0 && (
        <AddTransactionsTable
          columns={columns}
          data={addTransactions}
          dataLength={addTransactions.length}
        />
      )}
    </>
  );
};
