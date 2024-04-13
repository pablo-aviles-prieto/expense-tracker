import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { RegisterMailSchema } from "@/schemas/register-mail-schema";
import { z } from "zod";
import { generateChangeMailToken } from "@/services/user";
import { handleChangeEmailMail } from "@/utils/change-email-mail";

type ReqObjI = {
  userId: string;
  email: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const objToParse = { email: data.email };

  try {
    RegisterMailSchema.parse(objToParse);

    const existingUser = await UserModel.findById(data.userId);

    if (!existingUser) {
      return NextResponse.json(
        { ok: false, error: "Relog into your account and try again" },
        { status: 400 },
      );
    }

    const emailIsInUse = await UserModel.findOne({ email: data.email });

    if (!emailIsInUse) {
      const token = await generateChangeMailToken({
        email: data.email,
        userId: data.userId,
      });
      await handleChangeEmailMail({
        token,
        receiverMail: data.email,
        prevEmail: existingUser.email,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "If the email is not already registered, you will receive an email with the instructions",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("ERROR SENDING THE EMAIL TO CHANGE THE EMAIL", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.sendChangeEmail;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
