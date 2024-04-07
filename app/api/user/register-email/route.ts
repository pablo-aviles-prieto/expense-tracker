import connectDb from "@/lib/mongoose-config";
import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { RegisterMailSchema } from "@/schemas/register-mail-schema";
import { z } from "zod";
import { generateRegisterToken } from "@/services/user";
import { handleRegisterUserMail } from "@/utils/register-user-mail";

type ReqObjI = {
  email: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;

  try {
    RegisterMailSchema.parse(data);
    await connectDb();

    const existingUser = await UserModel.findOne({ email: data.email });

    if (!existingUser) {
      const token = await generateRegisterToken(data.email);
      await handleRegisterUserMail({
        token,
        receiverMail: data.email,
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
    console.log("ERROR REGISTERING EMAIL", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.registerEmail;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
