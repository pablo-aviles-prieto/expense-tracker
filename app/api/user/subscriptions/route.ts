import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

import { getUsersSubscriptions } from '@/services/user';
import { errorMessages } from '@/utils/const';

export const GET = async (req: NextRequest) => {
  try {
    const tokenNext = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const subscriptions = await getUsersSubscriptions(tokenNext?.id as string);

    return NextResponse.json({ ok: true, subscriptions }, { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : errorMessages.retrieveSubscriptions;
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
};
