import connectDb from "@/lib/mongoose-config";
import CategoriesModel from "@/models/categories/categories-model";
import { errorMessages } from "@/utils/const";
import { isInvalidUserId } from "@/utils/is-invalid-user-id";

type Args = {
  userId: string;
  categoriesNames: string[];
};

type ParsedTransactions = {
  name: string;
  id: string;
};

export const getCategoriesId = async ({ userId, categoriesNames }: Args) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();
  const categories = await CategoriesModel.find({
    name: { $in: categoriesNames },
  });
  const parsedTransactions = JSON.parse(
    JSON.stringify(categories),
  ) as ParsedTransactions[];
  return { ok: true, categories: parsedTransactions.map((cat) => cat.id) };
};
