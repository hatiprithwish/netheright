import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/backend/db";
import * as schema from "@/backend/db/models";
import { envConfig } from "@/lib/envConfig";

// Augment the session user type to include `id`
declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

export interface CurrentUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.user_sessions,
    verificationTokensTable: schema.verification_tokens,
  }),
  providers: [
    Google({
      clientId: envConfig.GOOGLE_CLIENT_ID,
      clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: envConfig.GITHUB_CLIENT_ID,
      clientSecret: envConfig.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  trustHost: !!envConfig.AUTH_TRUST_HOST,
});

// Server-side helper to get the current authenticated user.

export async function currentUser(): Promise<CurrentUser | null> {
  const session = await auth();

  const { id, name, email, image } = session?.user ?? {};

  if (!id) return null;

  return { id, name, email, image };
}
