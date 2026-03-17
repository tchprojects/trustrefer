import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-[#1f1f1f] bg-black px-6 py-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-white">TrustRefer Admin</span>
          <span className="text-xs text-[#555]">{session.user.email}</span>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-6 py-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
