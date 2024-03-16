import mongoose from "mongoose";
import { cache } from "react";
import connectDb from "@/lib/mongoose-config";
import { TransactionObjBack } from "@/types/transaction";
import TransactionModel from "@/models/transaction/transaction-model";
import { errorMessages } from "@/utils/const";
import { isInvalidUserId } from "@/utils/is-invalid-user-id";
import CategoriesModel from "@/models/categories/categories-model";
import type { Categories } from "@/types";
import { z } from "zod";
import { FilteredTransactionsSchema } from "@/schemas/filtered-transactions-schema";
import { IUser } from "@/models";
import { capitalizeFirstLetter } from "@/utils/capitalize-first-letter";
import UserModel from "@/models/user/user-model";
import { type EnhancedTransObj } from "@/app/api/transactions/update/route";
import "@/models/categories/categories-model";

type FilteredTransactions = z.infer<typeof FilteredTransactionsSchema>;

type QueryTransType = {
  userId: string;
  date: { $gte: string; $lte: string };
  amount?: Partial<{ $gte: number; $lt: number; $gt: number }>;
  $or?: Array<{ name?: { $regex: RegExp }; notes?: { $regex: RegExp } }>;
  categories?: { $in: (string | mongoose.Types.ObjectId)[] };
};

export const revalidate = 3600; // revalidate the data at most every hour
export const getAllTransactionsPerUser = cache(async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();
  const transactions = await TransactionModel.find({ userId })
    .sort({ date: -1 })
    .populate("categories");
  const parsedTransactions = JSON.parse(
    JSON.stringify(transactions),
  ) as TransactionObjBack[];
  return { ok: true, transactions: parsedTransactions };
});

export const getFilteredTransactions = async ({
  userId,
  startDate,
  endDate,
  transType,
  filterType,
  filterOperator,
  filterValue,
  filteredCategories,
  offset,
  limit,
}: FilteredTransactions) => {
  FilteredTransactionsSchema.parse({
    userId,
    startDate,
    endDate,
    transType,
    filterType,
    filterOperator,
    filterValue,
    filteredCategories,
  });

  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  const query: QueryTransType = {
    userId,
    date: { $gte: startDate, $lte: endDate },
  };

  if (transType === "incomes") {
    query.amount = { $gte: 0 };
  } else if (transType === "expenses") {
    query.amount = { $lt: 0 };
  }

  if (filteredCategories) {
    // Retrieving the categories ID list
    const categories = await CategoriesModel.find({
      name: { $in: filteredCategories },
    });
    const parsedCategories = JSON.parse(
      JSON.stringify(categories),
    ) as Categories[];
    const categoriesIdList = parsedCategories.map((cat) => cat.id);

    query.categories = {
      $in: categoriesIdList.map(
        (id: string) => new mongoose.Types.ObjectId(id),
      ),
    };
  }

  if (filterType === "Amount" && Number(filterValue)) {
    query.amount = {
      [filterOperator === "gt" ? "$gt" : "$lt"]: Number(filterValue),
    };
  } else if (filterType === "Name" && filterValue) {
    query.$or = [
      { name: { $regex: new RegExp(filterValue, "i") } },
      { notes: { $regex: new RegExp(filterValue, "i") } },
    ];
  }

  const totalCount = await TransactionModel.countDocuments(query);

  const transactions =
    offset !== undefined && limit !== undefined
      ? await TransactionModel.find(query)
          .sort({ date: -1 })
          .skip(offset)
          .limit(limit)
          .populate("categories")
      : await TransactionModel.find(query)
          .sort({ date: -1 })
          .populate("categories");

  const parsedTransactions = JSON.parse(
    JSON.stringify(transactions),
  ) as TransactionObjBack[];
  return {
    ok: true,
    data: { list: parsedTransactions, totalCount },
    error: null,
  };
};

export const deleteTransactionsInBulk = async ({
  userId,
  transactions,
}: {
  userId: string;
  transactions: {
    transactionIds: string;
    categoriesId: Categories[];
  }[];
}) => {
  await connectDb();
  const transactionsObjectId = transactions.map(
    (obj) => new mongoose.Types.ObjectId(obj.transactionIds),
  );

  const resultDeleted = await TransactionModel.deleteMany({
    _id: { $in: transactionsObjectId },
  });

  const allCategoryIds = [
    //@ts-ignore
    ...new Set(
      transactions.flatMap((transaction) =>
        transaction.categoriesId
          .filter((cat) => !cat.common) // not deleting the commons categories on the user prop
          .map((category) => category.id),
      ),
    ),
  ].map((id: string) => new mongoose.Types.ObjectId(id));

  const countedTransactionsPromiseArray = allCategoryIds.map(async (catId) => {
    const count = await TransactionModel.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      categories: { $in: catId },
    });
    return { catId, count };
  });
  const countedTransactions = await Promise.all(
    countedTransactionsPromiseArray,
  );

  const categoriesToRemove = countedTransactions
    .filter((trans) => trans.count <= 0)
    .map((cat) => cat.catId);

  await UserModel.findByIdAndUpdate(
    userId,
    {
      $pullAll: {
        categories: categoriesToRemove,
      },
    },
    { new: true },
  );

  return {
    ok: true,
    result: resultDeleted,
    deletedCount: resultDeleted.deletedCount,
  };
};

interface UpdateSingleTransactionParams {
  transaction: EnhancedTransObj;
}
export const updateSingleTransaction = async ({
  transaction,
}: UpdateSingleTransactionParams) => {
  const { id, categories, ...transactionData } = transaction;

  // Retrieve the transaction and the user associated with it
  const existingTransaction =
    await TransactionModel.findById(id).populate("userId");
  if (!existingTransaction)
    throw new Error("Transaction not found. Please relog into your account");
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
  return updated;
};
