import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import { deleteTransactionsInBulk } from "@/services/transactions";
import { getToken } from "next-auth/jwt";
import connectDb from "@/lib/mongoose-config";
import { Categories } from "@/types";

interface ReqBody {
  transactions: { transactionIds: string; categoriesId: Categories[] }[];
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { transactions } = (await req.json()) as ReqBody;

    await connectDb();

    const tokenNext = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!tokenNext || !tokenNext.id) {
      return NextResponse.json(
        { ok: false, error: errorMessages.relogAcc },
        { status: 400 },
      );
    }

    const result = await deleteTransactionsInBulk({
      userId: tokenNext.id as string,
      transactions,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log("ERROR DELETING TRANSACTIONS", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.deletingTransactions },
      { status: 500 },
    );
  }
};
