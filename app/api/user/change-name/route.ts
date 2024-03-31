import connectDb from "@/lib/mongoose-config";
import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChangeNameSchema } from "@/schemas/change-name-schema";

type ReqObjI = {
  userId: string;
  name: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const objToParse = { name: data.name };

  try {
    ChangeNameSchema.parse(objToParse);
    await connectDb();

    await UserModel.findByIdAndUpdate(data.userId, {
      name: data.name,
    });

    return NextResponse.json(
      {
        ok: true,
        message: `Name has been changed successfully to ${data.name}`,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("ERROR CHANGING THE NAME", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.changeName;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
