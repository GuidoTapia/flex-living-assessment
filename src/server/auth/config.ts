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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
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
      async authorize(credentials) {
        console.log(
          "🔐 Credentials Provider - Received credentials:",
          credentials,
        );

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credentials Provider - Missing email or password");
          return null;
        }

        console.log(
          "🔍 Credentials Provider - Looking for user:",
          credentials.email,
        );
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          console.log("❌ Credentials Provider - User not found");
          return null;
        }

        console.log("👤 Credentials Provider - User found:", {
          id: user.id,
          email: user.email,
          hasPassword: !!user.password,
        });

        // Check if user has a password (for credential-based auth)
        if (!user.password) {
          console.log("❌ Credentials Provider - User has no password");
          return null;
        }

        console.log("🔑 Credentials Provider - Comparing passwords");
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password as string,
        );

        if (!isPasswordValid) {
          console.log("❌ Credentials Provider - Password invalid");
          return null;
        }

        console.log("✅ Credentials Provider - Authentication successful");
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
      console.log("📝 Session Callback - Session:", session);
      console.log("📝 Session Callback - Token:", token);
      const result = {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
      console.log("📝 Session Callback - Result:", result);
      return result;
    },
    jwt: ({ token, user }) => {
      console.log("🔑 JWT Callback - Token:", token);
      console.log("🔑 JWT Callback - User:", user);
      if (user) {
        token.sub = user.id;
        console.log("🔑 JWT Callback - Set token.sub to:", user.id);
      }
      return token;
    },
    redirect: ({ url, baseUrl }) => {
      console.log("🔄 Redirect Callback - URL:", url);
      console.log("🔄 Redirect Callback - Base URL:", baseUrl);
      // Always redirect to dashboard after successful sign in
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}/dashboard`;
        console.log("🔄 Redirect Callback - Redirecting to:", redirectUrl);
        return redirectUrl;
      }
      // If it's a full URL, check if it's the same origin
      if (new URL(url).origin === baseUrl) {
        console.log("🔄 Redirect Callback - Same origin, redirecting to:", url);
        return url;
      }
      const fallbackUrl = `${baseUrl}/dashboard`;
      console.log("🔄 Redirect Callback - Fallback redirect to:", fallbackUrl);
      return fallbackUrl;
    },
  },
} satisfies NextAuthConfig;
