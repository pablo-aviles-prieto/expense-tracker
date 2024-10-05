import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { CreateSubSchema } from '@/schemas/create-subscription-schema';
import { addSubscriptionToUser } from '@/services/user';
import type { EnhancedSubscription } from '@/types';
import { errorMessages } from '@/utils/const';

interface ReqObjI {
  subscriptionData: EnhancedSubscription;
}

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const { subscriptionData } = data;

  try {
    CreateSubSchema.parse(subscriptionData);

    const tokenNext = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!tokenNext || !tokenNext.id) {
      return NextResponse.json({ ok: false, error: errorMessages.relogAcc }, { status: 400 });
    }
    const parsedSubData = { ...subscriptionData };
    // @ts-expect-error deleting _id property
    delete parsedSubData._id;

    const updatedUser = await addSubscriptionToUser({
      userId: tokenNext.id as string,
      subscription: parsedSubData,
    });

    return NextResponse.json({ ok: true, updatedUser }, { status: 201 });
  } catch (err) {
    console.log('ERROR ADDING SUBSCRIPTION TO THE USER', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectSubscriptionData },
        { status: 400 }
      );
    }
    const errorMessage = err instanceof Error ? err.message : errorMessages.addingSubscription;
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
};
