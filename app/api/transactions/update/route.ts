import { NextRequest, NextResponse } from "next/server";
import { errorMessages } from "@/utils/const";
import type { TransactionObj } from "@/types";
import TransactionModel from "@/models/transaction/transaction-model";
import CategoriesModel from "@/models/categories/categories-model";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import { IUser } from "@/models";
import mongoose from "mongoose";
import UserModel from "@/models/user/user-model";

export interface EnhancedTransObj extends TransactionObj {
  id: string;
}

interface ReqBody {
  transaction: EnhancedTransObj;
}

export const POST = async (req: NextRequest) => {
  try {
    const { transaction } = (await req.json()) as ReqBody;
    const { id, categories, ...transactionData } = transaction;

    // Retrieve the transaction and the user associated with it
    const existingTransaction =
      await TransactionModel.findById(id).populate("userId");
    if (!existingTransaction) throw new Error("Transaction not found");
    const user = existingTransaction.userId as unknown as IUser;

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

    const updated = await TransactionModel.findByIdAndUpdate(
      id,
      {
        ...transactionData,
        categories: processedCategories,
      },
      { new: true },
    );

    return NextResponse.json({ ok: true, data: updated }, { status: 200 });
  } catch (err) {
    console.log("ERROR UPDATING TRANSACTION", err);
    return NextResponse.json(
      { ok: false, error: errorMessages.updateTransaction },
      { status: 500 },
    );
  }
};
