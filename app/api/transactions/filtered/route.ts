import { getCategoriesId } from "@/services/categories";
import { getFilteredTransactions } from "@/services/transactions";
import { errorMessages } from "@/utils/const";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const transType = searchParams.get("transType");
    const filterType = searchParams.get("filterType");
    const filterOperator = searchParams.get("filterOperator");
    const filterValue = searchParams.get("filterValue");
    const filteredCategories = searchParams.get("categories")?.split(",");

    return NextResponse.json(
      await getFilteredTransactions({
        userId: tokenNext.id,
        startDate: startDate ?? "",
        endDate: endDate ?? "",
        transType,
        filterType,
        filterOperator,
        filterValue,
        filteredCategories: filteredCategories,
      }),
      { status: 200 },
    );
  } catch (error) {
    // TODO: Improve error message, using the error
    console.error("ERROR", error);
    return NextResponse.json(
      { ok: false, error: errorMessages.generic },
      { status: 500 },
    );
  }
};
