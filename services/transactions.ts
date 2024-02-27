import mongoose from "mongoose";
import { cache } from "react";
import connectDb from "@/lib/mongoose-config";
import { TransactionObjBack } from "@/types/transaction";
import TransactionModel from "@/models/transaction/transaction-model";
import { errorMessages } from "@/utils/const";
import { isInvalidUserId } from "@/utils/is-invalid-user-id";
import CategoriesModel from "@/models/categories/categories-model";
import type { Categories } from "@/types";

import "@/models/categories/categories-model";
import { z } from "zod";
import { FilteredTransactionsSchema } from "@/schemas/filtered-transactions-schema";

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
