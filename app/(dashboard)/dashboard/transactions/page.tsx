import { redirect } from "next/navigation";

export default async function Transactions() {
  console.log("transactions");
  redirect("/dashboard/transactions/list");
}
