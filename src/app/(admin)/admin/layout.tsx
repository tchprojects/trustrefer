import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AccountDropdown } from "@/components/layout/AccountDropdown";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = session?.user?.role ?? "";

  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#1f1f1f] bg-black px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-white transition-opacity hover:opacity-70">
              TrustRefer
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-sm text-[#555]">Admin</span>
          </div>
          <AccountDropdown
            name={session.user.name ?? null}
            email={session.user.email ?? null}
            membershipTier={session.user.membershipTier ?? "STANDARD"}
            role={session.user.role ?? "ADMIN"}
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-6 py-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
