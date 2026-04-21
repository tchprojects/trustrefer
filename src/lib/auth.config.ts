import type { NextAuthConfig } from "next-auth";
import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.membershipTier = user.membershipTier;
        // Record the moment this JWT was issued; used to detect sessions that
        // pre-date a password change (passwordChangedAt > tokenIssuedAt → stale).
        token.tokenIssuedAt = Math.floor(Date.now() / 1000);
      }
      // Re-read tier + role from DB when session.update() is called client-side
      // (e.g. after Stripe webhook confirms payment). This is the fix for the
      // "always shows Free after payment" bug.
      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { membershipTier: true, role: true },
        });
        if (dbUser) {
          token.membershipTier = dbUser.membershipTier;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as import("@prisma/client").Role;
        session.user.membershipTier = token.membershipTier as import("@prisma/client").MembershipTier;
      }
      return session;
    },
  },
};
