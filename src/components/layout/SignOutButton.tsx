"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-[#555] transition-colors hover:text-white"
    >
      Sign out
    </button>
  );
}
