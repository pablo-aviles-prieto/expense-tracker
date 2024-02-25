import { DefaultSession, User as NextAuthUser } from "next-auth";

export type TransactionsDateObj = { from: string; to: string } | null;

interface CustomUser extends NextAuthUser {
  id: string;
  transactionsDate?: TransactionsDateObj;
}

export interface CustomSessionI extends DefaultSession {
  user?: CustomUser;
  accessToken?: string;
}
