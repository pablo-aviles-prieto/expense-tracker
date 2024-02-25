import connectDb from "@/lib/mongoose-config";
import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { updateUserTransactionsDate } from "@/services/user";

type ReqObjI = {
  dates?: { from: string; to: string } | null;
};

export const POST = async (req: NextRequest) => {
  try {
    const tokenNext = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (
      !tokenNext ||
      !tokenNext.id ||
      typeof tokenNext.id !== "string" ||
      !mongoose.Types.ObjectId.isValid(tokenNext.id)
    ) {
      return NextResponse.json(
        { ok: false, error: errorMessages.relogAcc },
        { status: 400 },
      );
    }

    const data = (await req.json()) as ReqObjI;
    const { dates } = data;

    await connectDb();

    return NextResponse.json(
      await updateUserTransactionsDate({
        userId: tokenNext.id,
        transactionsDate: dates ?? null,
      }),
      { status: 200 },
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.createUser;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
