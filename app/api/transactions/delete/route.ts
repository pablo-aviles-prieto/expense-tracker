import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import { deleteTransactionsInBulk } from "@/services/transactions";

interface ReqBody {
  transactionIds: string[];
}

export const DELETE = async (req: NextRequest) => {
  try {
    const { transactionIds } = (await req.json()) as ReqBody;
    const result = await deleteTransactionsInBulk(transactionIds);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log("ERROR DELETING TRANSACTIONS", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.deletingTransactions },
      { status: 500 },
    );
  }
};
