import Link from "next/link";
import { CheckCircle } from "lucide-react";

const BENEFITS = [
  "Submit your own referral links",
  "Help the community by voting on links",
  "Report broken or outdated links",
  "Get notified when your submissions are approved",
];

export function UserBenefitPanel() {
  return (
    <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
      <h2 className="text-base font-semibold text-white">Join the community</h2>
      <p className="mt-1 text-sm text-[#888]">
        Submit your referral links and help others find trusted deals.
      </p>

      <ul className="mt-4 space-y-2">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-center gap-2 text-sm text-[#888]">
            <CheckCircle size={14} className="shrink-0 text-white/40" />
            {b}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:items-center">
        <Link
          href="/register"
          className="w-full rounded-md bg-white px-4 py-2 text-center text-sm font-medium text-black transition-colors hover:bg-[#e0e0e0] sm:w-auto"
        >
          Create free account
        </Link>
        <Link
          href="/login"
          className="text-center text-sm text-[#888] transition-colors hover:text-white"
        >
          Already a member? Sign in →
        </Link>
      </div>
    </div>
  );
}
