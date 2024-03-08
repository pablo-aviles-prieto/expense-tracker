"use client";

import { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import type { FilePondFile, FilePondInitialFile } from "filepond";
import { URL_UPLOAD_TRANSACTION_FILE } from "@/utils/const";
import { useAddTransactionTable } from "@/hooks/use-add-transaction-table";
import type { ResponseFile } from "@/types";
import { useToast } from "../ui/use-toast";

type InputFileBlock = {
  files: (FilePondInitialFile | Blob | File)[];
  setFiles: React.Dispatch<
    React.SetStateAction<(FilePondInitialFile | File | Blob)[]>
  >;
};

export const InputFileBlock = ({ files, setFiles }: InputFileBlock) => {
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();
  const { setAddTransactions } = useAddTransactionTable();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const updatedFiles: Array<FilePondInitialFile | File | Blob> =
      fileItems.map((fileItem) => fileItem.file);
    setFiles(updatedFiles);
  };

  const handleFileProcessed = (response: any) => {
    const { ok: responseOk, data }: ResponseFile = JSON.parse(response);
    if (responseOk && data) {
      setAddTransactions((prevState) => {
        const parsedTrans = data.map((trans, i) => ({
          ...trans,
          id: prevState.length + i,
        }));
        return [...prevState, ...parsedTrans];
      });
      return "success";
    }
    return "failure";
  };

  return (
    <div
      className="file-wrapper max-w-[400px] mx-auto my-4"
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
  );
};
