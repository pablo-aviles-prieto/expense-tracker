import { DefaultSession, User as NextAuthUser } from "next-auth";

interface CustomUser extends NextAuthUser {
  id: string;
}

export interface CustomSessionI extends DefaultSession {
  user?: CustomUser;
  accessToken?: string;
}
