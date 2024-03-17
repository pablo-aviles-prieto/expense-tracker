import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import type { TransactionObj } from "@/types";
import TransactionModel from "@/models/transaction/transaction-model";
import CategoriesModel from "@/models/categories/categories-model";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import mongoose from "mongoose";
import UserModel from "@/models/user/user-model";
import { getToken } from "next-auth/jwt";

interface ReqBody {
  transaction: TransactionObj;
}

export const POST = async (req: NextRequest) => {
  try {
    const { transaction } = (await req.json()) as ReqBody;
    const { categories, ...transactionData } = transaction;

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

    const user = await UserModel.findById(tokenNext.id).populate("categories");
    if (!user) {
      return NextResponse.json(
        { ok: false, error: errorMessages.relogAcc },
        { status: 400 },
      );
    }

    // Process each category
    const processedCategories = await Promise.all(
      categories.map(async (category) => {
        // Return existing category ID (parsed to ObjectId)
        if (!category.newEntry) return new mongoose.Types.ObjectId(category.id);

        // Check if the category already exists (case insensitive)
        let existingCategory = await CategoriesModel.findOne({
          name: { $regex: new RegExp("^" + category.name + "$", "i") },
        });

        if (!existingCategory) {
          // Create new category
          existingCategory = await new CategoriesModel({
            name: capitalizeFirstLetter(category.name),
          }).save();
        }
        // Update user's categories if the new category is not already associated
        if (!user.categories.includes(existingCategory._id)) {
          await UserModel.findByIdAndUpdate(user._id, {
            $addToSet: { categories: existingCategory._id },
          });
        }
        return existingCategory._id;
      }),
    );

    const created = await TransactionModel.create({
      ...transactionData,
      categories: processedCategories,
      userId: new mongoose.Types.ObjectId(tokenNext.id as string),
    });

    return NextResponse.json({ ok: true, data: created }, { status: 200 });
  } catch (err) {
    console.log("ERROR CREATING TRANSACTION", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.createTransaction },
      { status: 500 },
    );
  }
};
