import { Share2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ShareButton } from "./ShareButton";

export async function Header() {
  const session = await auth();
  const user = session?.user as any;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-70"
        >
          TrustRefer
        </Link>

        <div className="flex items-center gap-3">
          <ShareButton />

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-[#555] sm:block">
                {user.name ?? user.email}
                <span className="ml-1.5 rounded border border-white/10 bg-[#111] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[#666]">
                  {user.membershipTier === "PREMIUM" ? "Premium" : "Standard"}
                </span>
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm text-[#555] transition-colors hover:text-white"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#666] transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white transition-colors hover:border-white/40 hover:bg-white/5"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
