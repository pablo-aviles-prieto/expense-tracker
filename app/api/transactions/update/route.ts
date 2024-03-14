import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import type { TransactionObj } from "@/types";
import { updateSingleTransaction } from "@/services/transactions";

export interface EnhancedTransObj extends TransactionObj {
  id: string;
}

interface ReqBody {
  transaction: EnhancedTransObj;
}

export const POST = async (req: NextRequest) => {
  try {
    const { transaction } = (await req.json()) as ReqBody;

    const updated = updateSingleTransaction({ transaction });

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (err) {
    console.log("ERROR UPDATING TRANSACTION", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.updateCategory },
      { status: 500 },
    );
  }
};
