import { FilteredTransactionsSchema } from "@/schemas/filtered-transactions-schema";
import { getFilteredTransactions } from "@/services/transactions";
import { errorMessages } from "@/utils/const";
import { parseZodErrors } from "@/utils/parse-zod-errors";
import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

    const parsedParams = FilteredTransactionsSchema.safeParse({
      userId: tokenNext.id,
      startDate,
      endDate,
      transType,
      filterType,
      filterOperator,
      filterValue,
      filteredCategories,
    });

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parseZodErrors({ error: parsedParams.error }),
          data: null,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(await getFilteredTransactions(parsedParams.data), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: parseZodErrors({ error }), data: null },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: errorMessages.generic, data: null },
      { status: 500 },
    );
  }
};
