import { Metadata } from "next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import { getServerSession, type NextAuthOptions } from "next-auth";

export const metadata: Metadata = {
  title: "Expense tracker",
  description: "Manage your expenses and incomes easily!",
};

export default async function Home() {
  const session = await getServerSession(
    authOptions as unknown as NextAuthOptions,
  );
  redirect(session?.user ? "/dashboard" : "/auth");
}
