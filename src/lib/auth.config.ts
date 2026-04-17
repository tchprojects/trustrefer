import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.membershipTier = user.membershipTier;
        // Record the moment this JWT was issued; used to detect sessions that
        // pre-date a password change (passwordChangedAt > tokenIssuedAt → stale).
        token.tokenIssuedAt = Math.floor(Date.now() / 1000);
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
