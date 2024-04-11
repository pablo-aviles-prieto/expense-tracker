import { Dashboard } from "@/components/dashboard/components/dashboard-block";
import { authOptions } from "@/lib/auth-options";
import { type NextAuthOptions, getServerSession } from "next-auth";

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
  };
};

export default async function page({ searchParams }: ParamsProps) {
  const session = await getServerSession(
    authOptions as unknown as NextAuthOptions,
  );
  const { viewport } = searchParams;

  return <Dashboard session={session} viewport={viewport} />;
}
