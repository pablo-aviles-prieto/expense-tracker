import { isInvalidUserId } from "@/utils/is-invalid-user-id";
import UserModel from "@/models/user/user-model";
import { errorMessages } from "@/utils/const";
import connectDb from "@/lib/mongoose-config";

type UpdateUserTransactionsDateProps = {
  userId: string;
  transactionsDate: { from: string; to: string } | null;
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
