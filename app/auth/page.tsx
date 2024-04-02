import { AuthBlock } from "@/components/auth-block";
import { authOptions } from "@/lib/auth-options";
import { NextAuthOptions, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthenticationPage() {
  const session = await getServerSession(
    authOptions as unknown as NextAuthOptions,
  );

  if (session?.user) {
    redirect("/dashboard");
  }

  return <AuthBlock />;
}
