import connectDb from "@/lib/mongoose-config";
import CategoriesModel from "@/models/categories/categories-model";
import type { Categories } from "@/types";
import { errorMessages } from "@/utils/const";
import { isInvalidUserId } from "@/utils/is-invalid-user-id";

type Args = {
  userId: string;
  categoriesNames: string[];
};
export const getCategoriesId = async ({ userId, categoriesNames }: Args) => {
  if (isInvalidUserId(userId)) {
    throw new Error(errorMessages.invalidUserId);
  }

  await connectDb();
  const categories = await CategoriesModel.find({
    name: { $in: categoriesNames },
  });
  const parsedCategories = JSON.parse(
    JSON.stringify(categories),
  ) as Categories[];
  return { ok: true, categories: parsedCategories.map((cat) => cat.id) };
};
