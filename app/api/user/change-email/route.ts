import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import connectDb from '@/lib/mongoose-config';
import UserModel from '@/models/user/user-model';
import { RegisterMailSchema } from '@/schemas/register-mail-schema';
import { errorMessages } from '@/utils/const';

type ReqObjI = {
  userId: string;
  email: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const objToParse = { email: data.email };

  try {
    RegisterMailSchema.parse(objToParse);
    const conn = await connectDb();
    const db = conn.connection.db;

    if (!db) {
      throw new Error('Database connection is undefined');
    }

    const emailIsInUse = await UserModel.findOne({ email: data.email });

    if (emailIsInUse) {
      return NextResponse.json({ ok: false, error: errorMessages.incorrectData }, { status: 400 });
    }

    const existingUser = await UserModel.findByIdAndUpdate(data.userId, {
      email: data.email,
    });

    if (!existingUser) {
      return NextResponse.json(
        { ok: false, error: 'Relog into your account and try again' },
        { status: 400 }
      );
    }

    await db.collection('accounts').deleteOne({ userId: existingUser._id });

    return NextResponse.json(
      {
        ok: true,
        message: 'Email changed, please log in with the new credentials',
      },
      { status: 200 }
    );
  } catch (err) {
    console.log('ERROR CHANGING THE EMAIL', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json({ ok: false, error: errorMessages.incorrectData }, { status: 400 });
    }
    const errorMessage = err instanceof Error ? err.message : errorMessages.changeEmail;
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
};
