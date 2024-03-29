import { errorMessages } from "@/utils/const";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { deleteSubscriptions } from "@/services/user";

interface ReqObjI {
  subscriptionIds: string[];
}

export const DELETE = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const { subscriptionIds } = data;

  try {
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

    const result = await deleteSubscriptions({
      userId: tokenNext.id as string,
      subscriptionIds,
    });

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } catch (err) {
    console.log("ERROR DELETING SUBSCRIPTION TO THE USER", err);
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.deletingSubscriptions;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
