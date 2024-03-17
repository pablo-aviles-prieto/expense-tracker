import mongoose from "mongoose";
import connectDb from "../lib/mongoose-config";
import CategoriesModel from "../models/categories/categories-model";

const removeUncommonCategories = async () => {
  try {
    await connectDb();
    const result = await CategoriesModel.deleteMany({
      common: { $ne: true },
    });
    console.log("Uncommon categories removed. Count:", result.deletedCount);
  } catch (error) {
    console.error("Error removing uncommon categories:", error);
  } finally {
    await mongoose.connection.close();
  }
};

void removeUncommonCategories();
