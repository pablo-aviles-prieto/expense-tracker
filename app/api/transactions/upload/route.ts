import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import { FIELDS_FROM_CSV, errorMessages } from "@/utils/const";
import type { TransactionBulk } from "@/types";

// TODO: Receive the date format and a map indicating which column is
// Date, Concept, Amount, Notes to obtain them from the CSV received
export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const objFile = Object.fromEntries(formData);
  // Retrieving the files field provided in the filepond component
  const csvFile: File = objFile.files as File;

  if (!csvFile || csvFile.type !== "text/csv") {
    return NextResponse.json(
      { ok: false, error: errorMessages.fileType },
      { status: 400 },
    );
  }

  const results: TransactionBulk[] = [];

  return new Promise<NextResponse>((resolve) => {
    const csvReadableStream = new Readable();
    csvReadableStream._read = () => {};

    csvFile
      .arrayBuffer()
      .then((buffer) => {
        csvReadableStream.push(Buffer.from(buffer));
        csvReadableStream.push(null);

        csvReadableStream
          .pipe(csv({ separator: ";" }))
          .on("data", (data) => results.push(data as TransactionBulk))
          .on("end", () => {
            const parsedResults = results.map((originalObject) => {
              return (FIELDS_FROM_CSV as (keyof TransactionBulk)[]).reduce(
                (
                  acc: Partial<TransactionBulk>,
                  field: keyof TransactionBulk,
                ) => {
                  if (field in originalObject) {
                    // @ts-ignore
                    acc[field] = originalObject[field];
                  }
                  return acc;
                },
                {},
              );
            });
            resolve(
              NextResponse.json(
                { ok: true, data: parsedResults },
                { status: 200 },
              ),
            );
          });
      })
      .catch((err) => {
        resolve(
          NextResponse.json(
            { ok: false, error: errorMessages.fileParsing },
            { status: 500 },
          ),
        );
      });
  });
};
