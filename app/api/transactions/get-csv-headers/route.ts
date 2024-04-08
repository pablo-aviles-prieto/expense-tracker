import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import { guessCSVDelimiter } from "@/utils/guess-csv-delimiter";

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

  try {
    const buffer = await csvFile.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    const headersLine = text.replaceAll("\r", "").split(/\r\n|\n|\r/)[0];
    const delimeter = guessCSVDelimiter(headersLine);
    const headersArray = headersLine.split(delimeter);
    const uniqueHeaders = new Set(headersArray);

    return NextResponse.json(
      { ok: true, headers: Array.from(uniqueHeaders) },
      { status: 200 },
    );
  } catch (err) {
    console.log("ERROR PARSING CSV HEADERS", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.fileParsing },
      { status: 500 },
    );
  }
};
