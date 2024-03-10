import mongoose from "mongoose";
import connectDb from "../lib/mongoose-config";
import TransactionModel from "../models/transaction/transaction-model";

async function clearCollection() {
  try {
    await connectDb();
    await TransactionModel.deleteMany({});
    console.log("Transactions cleared successfully.");
  } catch (error) {
    console.error("Error clearing collection:", error);
  } finally {
    await mongoose.connection.close();
  }
}

void clearCollection();
