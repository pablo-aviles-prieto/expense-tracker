import { redirect } from "next/navigation";

export default async function Transactions() {
  redirect("/dashboard/transactions/list");
}
