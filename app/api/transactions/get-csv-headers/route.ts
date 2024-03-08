import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import csv from "csv-parser";
import { errorMessages } from "@/utils/const";

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

  return new Promise<NextResponse>((resolve) => {
    const csvReadableStream = new Readable({
      read() {},
    });
    let headers: string[] | null = null;

    csvFile
      .arrayBuffer()
      .then((buffer) => {
        csvReadableStream.push(Buffer.from(buffer));
        csvReadableStream.push(null); // Indicates the end of the stream

        csvReadableStream
          .pipe(csv({ separator: ";" }))
          .on("headers", (headersReceived) => {
            headers = headersReceived; // Capture headers
          })
          .on("finish", () => {
            if (headers) {
              resolve(
                NextResponse.json({ ok: true, headers }, { status: 200 }),
              );
            } else {
              resolve(
                NextResponse.json(
                  { ok: false, error: errorMessages.csvNoColumns },
                  { status: 400 },
                ),
              );
            }
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
