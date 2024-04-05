import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ContactMailFormValue,
  ContactMailSchema,
} from "@/schemas/contact-mail-schema";
import { handleContactMail } from "@/utils/contact-mail";

type ReqObjI = {
  contact: ContactMailFormValue;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;

  try {
    ContactMailSchema.parse(data.contact);

    await handleContactMail({ data: data.contact });

    return NextResponse.json(
      {
        ok: true,
        message: "We will try to get back at you as soon as possible 🥰",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("ERROR SENDING THE CONTACT EMAIL", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.contactEmail;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
