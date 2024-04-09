import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import { FIELDS_FROM_CSV, errorMessages } from "@/utils/const";
import type { TransactionBulk } from "@/types";
import { getTransactionsCategories } from "@/utils/get-transactions-categories";
import { guessCSVDelimiter } from "@/utils/guess-csv-delimiter";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const mappedValues = Object.fromEntries(formData) as Record<string, string>;
  const csvFiles: File[] = formData.getAll("files") as File[];

  if (!csvFiles || csvFiles.some((csvFile) => csvFile.type !== "text/csv")) {
    return NextResponse.json(
      { ok: false, error: errorMessages.fileType },
      { status: 400 },
    );
  }

  let allParsedResults: Partial<TransactionBulk>[] = [];

  const processFile = async (file: File) => {
    const results: TransactionBulk[] = [];
    return new Promise<Partial<TransactionBulk>[]>(async (resolve, reject) => {
      const fileContent = await file.text();
      const firstLine = fileContent.split("\n")[0];
      const guessedDelimiter = guessCSVDelimiter(firstLine);

      const csvReadableStream = new Readable();
      csvReadableStream._read = () => {};
      csvReadableStream.push(Buffer.from(await file.arrayBuffer()));
      csvReadableStream.push(null);

      csvReadableStream
        .pipe(csv({ separator: guessedDelimiter }))
        .on("data", (data) => {
          // Transform the data based on mappings
          const transformedData = FIELDS_FROM_CSV.reduce((acc, field) => {
            const mappedKey = mappedValues[field as keyof typeof mappedValues];
            if (mappedKey && data[mappedKey] !== undefined) {
              acc[field as keyof TransactionBulk] = data[mappedKey];
            }

            // Directly categorize if the field is 'Concept'
            if (field === "Concept") {
              acc.selectedCategories = getTransactionsCategories(
                data[mappedKey],
              );
            }
            return acc;
          }, {} as Partial<TransactionBulk>);
          results.push(transformedData as TransactionBulk);
        })
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    });
  };
  for (const eachFile of csvFiles) {
    try {
      const parsedResults = await processFile(eachFile);
      allParsedResults = allParsedResults.concat(parsedResults);
    } catch (err) {
      console.log("ERROR PARSING CSVs", err);
      return NextResponse.json(
        { ok: false, error: errorMessages.fileParsing },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { ok: true, data: allParsedResults },
    { status: 200 },
  );
};
