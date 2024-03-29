import { hash } from "bcryptjs";
import connectDb from "@/lib/mongoose-config";
import UserModel from "@/models/user/user-model";
import { bcryptSalt } from "@/utils/gen-bcrypt-salt";
import { errorMessages } from "@/utils/const";
import CategoriesModel from "@/models/categories/categories-model";
import { NextRequest, NextResponse } from "next/server";
import { ForgotPasswordFormSchema } from "@/schemas/forgot-password-schema";
import { z } from "zod";
import { generateRecoveryToken, verifyRecoveryToken } from "@/services/user";
import { handleResetPasswordMail } from "@/utils/reset-password-mail";

type ReqObjI = {
  email: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;

  ForgotPasswordFormSchema.parse(data);

  try {
    await connectDb();

    const existingUser = await UserModel.findOne({ email: data.email });

    if (existingUser) {
      const token = await generateRecoveryToken(existingUser.id);
      const result = await handleResetPasswordMail({
        token,
        receiverMail: data.email,
      });
      console.log("result", result);
      // const decodedToken = await verifyRecoveryToken(token);

      // TODO: The user may try to recover the password into an account that doesnt have
      // a password stored since it was created by the google provider, so it could add
      // a password to it.
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "If the email is registered, you will receive an email with the instructions",
      },
      { status: 201 },
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
