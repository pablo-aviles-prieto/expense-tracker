import connectDb from "@/lib/mongoose-config";
import { TransactionObjBack } from "@/types/transaction";
import TransactionModel from "@/models/transaction/transaction-model";
import { errorMessages } from "@/utils/const";
import { isInvalidUserId } from "@/utils/is-invalid-user-id";
import { cache } from "react";

import "@/models/categories/categories-model";
import mongoose from "mongoose";

type FilteredTransactions = {
  userId: string;
  startDate: string;
  endDate: string;
  transType: string | null;
  filterType: string | null;
  filterOperator: string | null;
  filterValue: string | null;
  filteredCategories: string[] | undefined;
};

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
}: FilteredTransactions) => {
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
    query.categories = {
      $in: filteredCategories.map(
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

  const transactions = await TransactionModel.find(query)
    .sort({ date: -1 })
    .populate("categories");

  const parsedTransactions = JSON.parse(
    JSON.stringify(transactions),
  ) as TransactionObjBack[];
  return { ok: true, transactions: parsedTransactions };
};
