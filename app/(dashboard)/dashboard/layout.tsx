import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expense tracker",
  description: "Manage your expenses and incomes easily!",
};

// TODO: Add a contact form in the user menu on the header
// TODO: Add a readme
// TODO: Add some metada data
// TODO: Check not leaking any key into the client
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-screen mx-auto overflow-hidden max-w-screen-2xl">
        <Sidebar />
        <main className="w-full pt-16 overflow-hidden">{children}</main>
      </div>
    </>
  );
}
