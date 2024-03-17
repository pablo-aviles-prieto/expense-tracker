"use client";

import { useEffect, useState } from "react";
import { FilePond } from "react-filepond";
import type { FilePondFile, FilePondInitialFile } from "filepond";
import { URL_GET_CSV_HEADERS } from "@/utils/const";
import type { ResponseFileHeaders } from "@/types";
import { useToast } from "../../ui/use-toast";

type InputFileBlock = {
  files: (FilePondInitialFile | Blob | File)[];
  setFiles: React.Dispatch<
    React.SetStateAction<(FilePondInitialFile | File | Blob)[]>
  >;
  setCSVHeaders: React.Dispatch<React.SetStateAction<string[]>>;
};

export const InputFileBlock = ({
  files,
  setFiles,
  setCSVHeaders,
}: InputFileBlock) => {
  const [isReady, setIsReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const handleUpdateFiles = (fileItems: FilePondFile[]) => {
    const updatedFiles: Array<FilePondInitialFile | File | Blob> =
      fileItems.map((fileItem) => fileItem.file);
    setFiles(updatedFiles);
  };

  const handleFileProcessedForHeaders = (response: any) => {
    const { ok: responseOk, headers }: ResponseFileHeaders =
      JSON.parse(response);
    if (responseOk && headers) {
      setCSVHeaders(headers);
      return "success";
    }
    return "failure";
  };

  return (
    <div
      className="file-wrapper max-w-[400px] mx-auto pt-4"
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
            url: URL_GET_CSV_HEADERS,
            method: "POST",
            withCredentials: false,
            onload: handleFileProcessedForHeaders,
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
