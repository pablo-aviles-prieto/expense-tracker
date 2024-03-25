import { isInvalidUserId } from "@/utils/is-invalid-user-id";
import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import connectDb from "@/lib/mongoose-config";
import type { ICategories } from "@/models";
import type { Subscription } from "@/types";
import mongoose from "mongoose";

type UpdateUserTransactionsDateProps = {
  userId: string;
  transactionsDate: { from: string; to: string } | null;
};

type AddSubscriptionToUserParams = {
  userId: string;
  subscription: Subscription;
};

/**
 * Updates the transactionsDate for a user.
 *
 * @param userId The ID of the user to update.
 * @param transactionsDate The transactionsDate object with from and to dates.
 * @returns Promise resolved with the updated user or null if not found.
 */
export const updateUserTransactionsDate = async ({
  userId,
  transactionsDate,
}: UpdateUserTransactionsDateProps) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  return UserModel.findByIdAndUpdate(
    userId,
    { $set: { transactionsDate } },
    { new: true },
  ).exec();
};

/**
 * Retrieves the transactionsDate for a specific user.
 *
 * @param {string} userId - The ID of the user whose transactionsDate is to be retrieved.
 * @returns {Promise<{from: string, to: string} | null>} The transactionsDate object or null if not found or on error.
 */
export const getUserTransactionsDate = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  const user = await UserModel.findById(userId, "transactionsDate").exec();
  if (!user || !user.transactionsDate) {
    throw new Error(errorMessages.generic);
  }

  return user.transactionsDate;
};

/**
 * Retrieves the categories associated with a specific user.
 *
 * @param {string} userId - The ID of the user whose categories are to be retrieved.
 * @returns {Promise<Array<{id: string, name: string, common: boolean}>>} An array of category objects, each containing the category's ID, name, and common status, or an empty array if the user has no categories.
 * @throws {Error} If the userId is invalid or if there's an error during database connection or query execution.
 */
export const getUserCategories = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  const userWithCategories = await UserModel.findById(userId)
    .populate("categories")
    .exec();

  if (!userWithCategories) {
    throw new Error(errorMessages.generic);
  }

  const categories = (
    userWithCategories.categories as unknown as ICategories[]
  ).map((category) => ({
    id: category._id.toString(), // Convert ObjectId to string
    name: category.name,
    common: category.common,
  }));

  return categories;
};

export const getUsersSubscriptions = async (userId: string) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  const user = await UserModel.findById(userId).exec();

  if (!user) {
    throw new Error(errorMessages.relogAcc);
  }

  return user.subscriptions;
};

export const addSubscriptionToUser = async ({
  userId,
  subscription,
}: AddSubscriptionToUserParams) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $push: { subscriptions: subscription } },
    { new: true },
  ).exec();

  if (!updatedUser) {
    throw new Error("User not found or update failed");
  }

  return updatedUser;
};
