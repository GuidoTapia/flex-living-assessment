import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, unknown> | undefined) {

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials as { email: string; password: string };

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }


        // Check if user has a password (for credential-based auth)
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      const result = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
      return result;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    redirect: ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}/dashboard`;
        return redirectUrl;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      const fallbackUrl = `${baseUrl}/dashboard`;
      return fallbackUrl;
    },
  },
} satisfies NextAuthConfig;
