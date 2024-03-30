import {
  User as NextAuthUser,
  DefaultSession,
  Account,
  Profile,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb-config";
import { ICategories, IUser } from "@/models";
import { JWT, encode } from "next-auth/jwt";
import { CustomSessionI, TransactionsDateObj } from "@/types";
import { compare } from "bcryptjs";
import { isAuthProvider } from "@/utils/is-auth-provider";
import { availableCurrency, availableDateFormatTypes } from "@/utils/const";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      id: "user-pw",
      name: "user/password",
      async authorize(credentials, req) {
        const client = await clientPromise;
        const user = (await client
          .db()
          .collection("users")
          .findOne({ email: credentials?.email })) as IUser | null;
        if (!user) return null;
        const passwordMatches = await compare(
          credentials?.password || "",
          user.password,
        );
        if (!passwordMatches) return null;
        const returnedUser = {
          ...user,
          id: user._id.toString(),
        };
        return returnedUser;
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "dark",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({
      token,
      trigger,
      user,
      session,
    }: {
      token: JWT;
      trigger: string;
      user?: CustomSessionI["user"];
      session: any;
    }) {
      // This callback is called whenever a JWT is created or updated.
      // When signing in, `user` will contain the user data returned by the `authorize` function.
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.transactionsDate = user.transactionsDate;
        token.currency = user.currency;
        token.dateFormat = user.dateFormat;
        token.theme = user.theme;
      }
      if (trigger === "update" && session?.transDates) {
        token.transactionsDate = session.transDates;
      }
      if (trigger === "update" && session?.currency) {
        token.currency = session.currency;
      }
      if (trigger === "update" && session?.dateFormat) {
        token.dateFormat = session.dateFormat;
      }
      return token;
    },
    async session({ session, token }: { session: DefaultSession; token: JWT }) {
      // This callback is called whenever the session data is accessed.
      // You can include additional user information from the `token` object.
      if (session.user) {
        const jwtString = await encode({
          token,
          secret: process.env.JWT_SECRET || "",
        });
        const customSession: Partial<CustomSessionI> & DefaultSession = {
          ...session,
          accessToken: jwtString,
          user: {
            ...session.user,
            id: token.id as string,
            name: token.name,
            email: token.email,
            image: token.image as string,
            transactionsDate: token.transactionsDate as TransactionsDateObj,
            currency: token.currency as string,
            dateFormat: token.dateFormat as string,
            theme: token?.theme as string | undefined,
          },
        };
        return customSession;
      }
      return session;
    },
    // Called only for signIn with providers (i.e. not at user-pw provider)
    async signIn({
      user,
      account,
      profile,
    }: {
      user: NextAuthUser;
      account: Account | null;
      profile?: Profile;
    }) {
      if (account && isAuthProvider(account.provider)) {
        const client = await clientPromise;
        const db = client.db();

        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });
        if (!existingUser) {
          const commonCategoriesCursor: ICategories[] = await db
            .collection<ICategories>("categories")
            .find({ common: true })
            .toArray();
          const commonCategories = commonCategoriesCursor.map(
            (category) => category._id,
          );

          const { id, ...dataUser } = user;
          const newUser = {
            ...dataUser,
            currency: availableCurrency.EUR,
            dateFormat: availableDateFormatTypes.EU,
            signupDate: new Date().toISOString(),
            categories: commonCategories,
          };
          const createdUser = await db.collection("users").insertOne(newUser);

          const newAccount = {
            ...account,
            userId: createdUser.insertedId,
          };
          await db.collection("accounts").insertOne(newAccount);
        } else {
          // Checking if the account exists in the account/providers table, if it does, just update it,
          // if it doesnt, have to create it, meaning the user firstly created the account manually
          // and now is trying to access via an email provider
          const accountUser = await db
            .collection("accounts")
            .findOne({ userId: existingUser._id });
          // If the user exist, it updates the expires_at prop
          if (accountUser) {
            await db
              .collection("accounts")
              .updateOne(
                { userId: existingUser._id },
                { $set: { expires_at: account.expires_at } },
              );
          } else {
            const newAccount = {
              ...account,
              userId: existingUser._id,
            };
            await db.collection("accounts").insertOne(newAccount);
          }
        }
      }
      return true; // Returning true will continue the sign-in process
    },
  },
  debug: false,
  pages: {
    signIn: "/",
  },
};
