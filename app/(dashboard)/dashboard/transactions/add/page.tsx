import { redirect } from "next/navigation";

export default async function TransactionsAdd() {
  redirect("/dashboard/transactions/add/multiple");
}
