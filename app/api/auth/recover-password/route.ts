import connectDb from "@/lib/mongoose-config";
import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { ForgotPasswordFormSchema } from "@/schemas/forgot-password-schema";
import { z } from "zod";
import { generateRecoveryToken } from "@/services/user";
import { handleResetPasswordMail } from "@/utils/reset-password-mail";

type ReqObjI = {
  email: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;

  try {
    ForgotPasswordFormSchema.parse(data);
    await connectDb();

    const existingUser = await UserModel.findOne({ email: data.email });

    if (existingUser) {
      const token = await generateRecoveryToken(existingUser.id);
      await handleResetPasswordMail({
        token,
        receiverMail: data.email,
      });
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "If the email is registered, you will receive an email with the instructions",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("ERROR SENDING THE RECOVERY PASSWORD EMAIL", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.recoveryPassword;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
