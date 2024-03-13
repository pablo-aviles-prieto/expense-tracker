import { errorMessages } from "@/utils/const";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import { getUserCategories } from "@/services/user";

export const GET = async (req: NextRequest) => {
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
    const categories = await getUserCategories(tokenNext.id);
    return NextResponse.json(
      { ok: true, categories },
      {
        status: 200,
      },
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.retrieveCategories;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
