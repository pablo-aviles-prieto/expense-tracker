import { DefaultSession, User as NextAuthUser } from "next-auth";

export type TransactionsDateObj = { from: string; to: string } | null;

interface CustomUser extends NextAuthUser {
  id: string;
  currency: string;
  dateFormat: string;
  theme?: string;
  transactionsDate?: TransactionsDateObj;
}

export interface CustomSessionI extends DefaultSession {
  user?: CustomUser;
  accessToken?: string;
}
