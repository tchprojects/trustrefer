"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { User, ChevronDown, LayoutDashboard, HeadphonesIcon, LogOut, ShieldCheck } from "lucide-react";

interface AccountDropdownProps {
  name: string | null;
  email: string | null;
  membershipTier: string;
  role: string;
}

const TIER_LABEL: Record<string, string> = {
  STANDARD: "Free",
  STARTER:  "Standard",
  PREMIUM:  "Pro",
};

export function AccountDropdown({ name, email, membershipTier, role }: AccountDropdownProps) {
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const displayName = name ?? email ?? "Account";
  const initial = displayName.charAt(0).toUpperCase();
  const tierLabel = TIER_LABEL[membershipTier] ?? "Free";

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-white/10 bg-[#0a0a0a] px-3 py-1.5 text-sm text-white transition-colors hover:border-white/20 hover:bg-white/5"
      >
        <User size={14} className="text-[#888]" />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown
          size={13}
          className={`text-[#555] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-[#0f0f0f] shadow-2xl shadow-black/60 ring-1 ring-white/5">

          {/* Profile header */}
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1f1f1f] text-sm font-semibold text-white ring-1 ring-white/10">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <span className="inline-block rounded border border-white/10 bg-[#1a1a1a] px-1.5 py-px text-[10px] uppercase tracking-wide text-[#666]">
                {tierLabel}
              </span>
            </div>
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Menu items */}
          <div className="py-1.5">
            <DropdownLink
              href="/account"
              icon={<LayoutDashboard size={14} />}
              label="Account Overview"
              onClick={() => setOpen(false)}
            />
            {isAdmin && (
              <DropdownLink
                href="/admin"
                icon={<ShieldCheck size={14} />}
                label="Admin Dashboard"
                onClick={() => setOpen(false)}
              />
            )}
            <DropdownLink
              href="mailto:support@trustrefer.co.uk"
              icon={<HeadphonesIcon size={14} />}
              label="Customer Service"
              onClick={() => setOpen(false)}
              external
            />
          </div>

          <div className="h-px bg-white/[0.06]" />

          {/* Log out */}
          <div className="py-1.5">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#888] transition-colors hover:bg-white/5 hover:text-red-400"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({
  href,
  icon,
  label,
  onClick,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  external?: boolean;
}) {
  const cls =
    "flex items-center gap-3 px-4 py-2.5 text-sm text-[#888] transition-colors hover:bg-white/5 hover:text-white";

  if (external) {
    return (
      <a href={href} className={cls} onClick={onClick}>
        {icon}
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {icon}
      {label}
    </Link>
  );
}
