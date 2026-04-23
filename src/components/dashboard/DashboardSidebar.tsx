"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Link2, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/links", label: "My Links", icon: Link2, exact: false },
  { href: "/dashboard/requests", label: "Requests", icon: PlusSquare, exact: false },
  { href: "/account", label: "Account", icon: User, exact: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: horizontal tab bar */}
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-1 sm:hidden">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors",
                active
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#555] hover:text-white"
              )}
            >
              <Icon size={16} />
              <span className="whitespace-nowrap text-[10px] leading-tight">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden w-48 shrink-0 sm:block">
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
    </>
  );
}
