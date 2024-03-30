import { hash } from "bcryptjs";
import connectDb from "@/lib/mongoose-config";
import UserModel from "@/models/user/user-model";
import { bcryptSalt } from "@/utils/gen-bcrypt-salt";
import {
  availableCurrency,
  availableDateFormatTypes,
  errorMessages,
} from "@/utils/const";
import CategoriesModel from "@/models/categories/categories-model";
import { NextRequest, NextResponse } from "next/server";

type ReqObjI = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const { name, email, password, image } = data;

  if (!name || !email || !password) {
    return NextResponse.json(
      { ok: false, error: errorMessages.missingData },
      { status: 400 },
    );
  }

  try {
    await connectDb();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { ok: false, error: errorMessages.credentials },
        { status: 400 },
      );
    }

    const salt = await bcryptSalt();
    const hashedPassword = await hash(password, salt);

    const getCategories = await CategoriesModel.find({ common: true });
    const commonCategories = getCategories.map((category) => category._id);

    const newUser = new UserModel({
      image: image,
      name,
      email,
      password: hashedPassword,
      signupDate: new Date().toISOString(),
      categories: commonCategories,
      currency: availableCurrency.EUR,
      dateFormat: availableDateFormatTypes.EU,
      theme: "system",
    });

    const savedUser = await newUser.save();
    return NextResponse.json(
      { ok: true, createdUser: savedUser },
      { status: 201 },
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.createUser;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
