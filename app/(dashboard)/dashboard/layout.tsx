import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";

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
