import type { TransactionObjBack } from "@/types";

type Params = {
  transactions: TransactionObjBack[];
  transType?: "incomes" | "expenses";
};

export const calculateTotalTypeTrans = ({
  transactions,
  transType = "incomes",
}: Params) => {
  return transactions.reduce((acc, transaction) => {
    if (transType === "incomes" && transaction.amount > 0) {
      return acc + transaction.amount;
    } else if (transType === "expenses" && transaction.amount < 0) {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);
};
