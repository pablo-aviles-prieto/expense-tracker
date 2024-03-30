import { authOptions } from "@/lib/auth-options";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions as unknown as NextAuthOptions);

export { handler as GET, handler as POST };
