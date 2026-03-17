"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, Users, Flag, PlusSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true, tip: "Dashboard stats" },
  { href: "/admin/links", label: "Links", icon: Link2, exact: false, tip: "Review pending submissions" },
  { href: "/admin/users", label: "Users", icon: Users, exact: false, tip: "Manage users" },
  { href: "/admin/reports", label: "Reports", icon: Flag, exact: false, tip: "Review flagged links" },
  { href: "/admin/brand-requests", label: "Brand Requests", icon: PlusSquare, exact: false, tip: "Review brand requests" },
  { href: "/admin/waitlist", label: "Waitlist", icon: Clock, exact: false, tip: "View waitlist entries" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#444]">Admin</p>
      <nav className="space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact, tip }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={tip}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "border-l-2 border-white bg-[#111] pl-2.5 text-white"
                  : "text-[#666] hover:bg-[#0a0a0a] hover:text-white"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
