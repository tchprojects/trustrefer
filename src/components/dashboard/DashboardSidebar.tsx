"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/links", label: "My Links", icon: Link2, exact: false },
  { href: "/dashboard/requests", label: "Brand Requests", icon: PlusSquare, exact: false },
  { href: "/account", label: "Account & Billing", icon: User, exact: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-48 shrink-0">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#444]">My Dashboard</p>
      <nav className="space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
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
