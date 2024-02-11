import mongoose from "mongoose";

export const isInvalidUserId = (userId: string) => {
  return typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId);
};
