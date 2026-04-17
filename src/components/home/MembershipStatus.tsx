"use client";

import { useState } from "react";
import { PLAN_MONTHLY_COST, PLANS } from "@/lib/pricing";

interface MembershipStatusProps {
  tier: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export function MembershipStatus({ tier, currentPeriodEnd, cancelAtPeriodEnd }: MembershipStatusProps) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(cancelAtPeriodEnd);

  const planName =
    tier === "PREMIUM" ? "Pro"
    : tier === "STARTER" ? "Starter"
    : "Free";

  const monthlyCost = PLAN_MONTHLY_COST[tier] ?? 0;
  const isPaid = monthlyCost > 0;

  const periodEndStr = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the end of this billing period.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (res.ok) setCancelled(true);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="mb-6 flex items-center justify-between rounded-md border border-white/10 bg-[#0a0a0a] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#111] text-xs font-semibold text-white">
          {planName[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {planName} plan
            {isPaid && (
              <span className="ml-2 text-xs font-normal text-[#888]">
                £{monthlyCost.toFixed(2)}/month
              </span>
            )}
          </p>
          {cancelled && periodEndStr ? (
            <p className="text-xs text-yellow-500">Cancels {periodEndStr}</p>
          ) : periodEndStr && isPaid ? (
            <p className="text-xs text-[#555]">Renews {periodEndStr}</p>
          ) : null}
        </div>
      </div>

      {isPaid && !cancelled && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="text-xs text-[#666] transition-colors hover:text-red-400 disabled:opacity-50"
        >
          {cancelling ? "Cancelling…" : "Cancel"}
        </button>
      )}
    </div>
  );
}
