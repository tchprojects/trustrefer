import Link from "next/link";
import { auth } from "@/lib/auth";
import { ShareButton } from "./ShareButton";
import { AccountDropdown } from "./AccountDropdown";

export async function Header() {
  const session = await auth();
  const user = session?.user;

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
            <AccountDropdown
              name={user.name ?? null}
              email={user.email ?? null}
              membershipTier={user.membershipTier ?? "STANDARD"}
            />
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
