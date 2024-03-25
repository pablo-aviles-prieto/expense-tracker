import connectDb from "@/lib/mongoose-config";
import type { Category, TransactionEndpointBody } from "@/types";
import { errorMessages } from "@/utils/const";
import UserModel from "@/models/user/user-model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import CategoriesModel from "@/models/categories/categories-model";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import mongoose from "mongoose";
import TransactionModel from "@/models/transaction/transaction-model";
import { TransactionsArraySchema } from "@/schemas/transaction-endpoint-body-schema";
import { z } from "zod";

interface ReqObjI {
  transactions: TransactionEndpointBody[];
}

type ParsedCat = {
  name: string;
  id: string;
};

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as ReqObjI;
  const { transactions } = data;

  try {
    // Validating each object in the transaction array, catching the zod error
    TransactionsArraySchema.parse(transactions);

    await connectDb();

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

    const user = await UserModel.findById(tokenNext.id);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: errorMessages.relogAcc },
        { status: 400 },
      );
    }

    // Fetch all categories from the database
    const allCategories = await CategoriesModel.find();
    const allCategoryNames = allCategories.map((cat) => cat.name.toLowerCase());

    // Collect new and existing categories in general
    const newGeneralCategories = new Set<string>();
    const existingGeneralCategories = new Map<string, Category>();

    transactions.forEach((trans) => {
      trans.selectedCategories.forEach((category) => {
        const catLowerCaseName = category.name.toLowerCase();
        if (allCategoryNames.includes(catLowerCaseName)) {
          const categoryFound = allCategories.find(
            (cat) => cat.name.toLowerCase() === catLowerCaseName,
          );
          const parsedCat = JSON.parse(
            JSON.stringify(categoryFound),
          ) as ParsedCat;
          existingGeneralCategories.set(parsedCat.id, parsedCat);
        } else {
          newGeneralCategories.add(catLowerCaseName);
        }
      });
    });

    let newCategoryIds: mongoose.Types.ObjectId[] = [];
    let newGeneralCatsArr: string[] = [];
    if (newGeneralCategories.size > 0) {
      // Insert new categories and get their IDs
      newGeneralCatsArr = Array.from(newGeneralCategories);
      const newCategoryDocs = newGeneralCatsArr.map((name) => ({
        insertOne: {
          document: { name: capitalizeFirstLetter(name) },
        },
      }));
      const bulkWriteResult = await CategoriesModel.bulkWrite(newCategoryDocs);
      newCategoryIds = Object.values(
        bulkWriteResult.insertedIds as mongoose.Types.ObjectId[],
      );
    }

    const combinedIdCategories = [
      ...newCategoryIds,
      ...Array.from(existingGeneralCategories.keys()).map(
        (id) => new mongoose.Types.ObjectId(id),
      ),
    ];

    const updatedUser = await UserModel.findByIdAndUpdate(
      tokenNext.id,
      {
        $addToSet: { categories: { $each: combinedIdCategories } },
      },
      { new: true },
    );

    // storing the ObjectId as key and the name string as value
    const combinedCategoriesObj = new Map<mongoose.Types.ObjectId, string>();
    newCategoryIds.forEach((newCat, i) => {
      combinedCategoriesObj.set(newCat, newGeneralCatsArr[i]);
    });
    Array.from(existingGeneralCategories.entries()).forEach(([id, catObj]) => {
      const parsedId = new mongoose.Types.ObjectId(id);
      combinedCategoriesObj.set(parsedId, catObj.name);
    });

    const parsedTransactions = transactions.map((trans) => {
      const parsedCategories = trans.selectedCategories.map((cat) => {
        let categoryId!: mongoose.Types.ObjectId;
        if (
          typeof cat.id === "string" &&
          mongoose.Types.ObjectId.isValid(cat.id)
        ) {
          // If id is a string and a valid ObjectId, convert it to ObjectId
          categoryId = new mongoose.Types.ObjectId(cat.id);
        } else {
          // If id is a number, search for the category name in the map
          for (const [mongoId, catName] of Array.from(
            combinedCategoriesObj.entries(),
          )) {
            if (catName.toLowerCase() === cat.name.toLowerCase()) {
              categoryId = mongoId;
              break;
            }
          }
        }
        return categoryId;
      });
      return { ...trans, categories: parsedCategories, userId: user._id };
    });

    const newTransDocs = parsedTransactions.map((trans) => ({
      insertOne: {
        document: trans,
      },
    }));
    const bulkTransResult = await TransactionModel.bulkWrite(newTransDocs);

    return NextResponse.json(
      {
        ok: true,
        insertedTransactions: bulkTransResult.insertedCount,
        updatedUser,
      },
      { status: 201 },
    );
  } catch (err) {
    console.log("ERROR UPLOADING TRANS", err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: errorMessages.incorrectTransactionsData },
        { status: 400 },
      );
    }
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.addingTransaction;
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 },
    );
  }
};
