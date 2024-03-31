import { Dashboard } from "@/components/dashboard/components/dashboard-block";
import { authOptions } from "@/lib/auth-options";
import { type NextAuthOptions, getServerSession } from "next-auth";

export default async function page() {
  const session = await getServerSession(
    authOptions as unknown as NextAuthOptions,
  );

  return <Dashboard session={session} />;
}
