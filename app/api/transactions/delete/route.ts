import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import { deleteTransactionsInBulk } from "@/services/transactions";

interface ReqBody {
  transactionIds: string[];
}

// TODO: Need to check on the transactions deleted, the categories on those transactions, and in case
// that are the only transactions using it, remove it from the user ??? But not from the categorty model
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
