import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { AccountDropdown } from "@/components/layout/AccountDropdown";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const tier = session?.user?.membershipTier ?? "STANDARD";

  if (!session?.user) redirect("/login?callbackUrl=/dashboard");
  if (tier === "STANDARD") redirect("/checkout?plan=standard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#1f1f1f] bg-black px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-white transition-opacity hover:opacity-70">
              TrustRefer
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-sm text-[#555]">Dashboard</span>
          </div>
          <AccountDropdown
            name={session.user.name ?? null}
            email={session.user.email ?? null}
            membershipTier={tier}
            role={session.user.role ?? "USER"}
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {/* On mobile sidebar renders as tab bar above content; on desktop as side column */}
        <div className="sm:flex sm:gap-8">
          <DashboardSidebar />
          <main className="mt-6 min-w-0 flex-1 sm:mt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
