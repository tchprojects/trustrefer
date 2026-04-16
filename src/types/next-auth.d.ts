import type { DefaultSession } from "next-auth";
import type { Role, MembershipTier } from "@prisma/client";

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: Role;
    membershipTier: MembershipTier;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      membershipTier: MembershipTier;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    membershipTier: MembershipTier;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    membershipTier: MembershipTier;
  }
}
