"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BillingStatus = "free" | "active" | "cancelling" | "past_due" | "expired";

interface BillingActionsProps {
  tier: string;
  billingStatus: BillingStatus;
  hasPortal: boolean;
}

export function BillingActions({ tier, billingStatus, hasPortal }: BillingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Could not open billing portal."); return; }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  async function cancelPlan() {
    if (!confirm("Cancel your subscription? You'll keep access until the end of this billing period.")) return;
    setLoading("cancel");
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      if (!res.ok) { setError("Could not cancel subscription."); return; }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      {/* Free tier — upgrade buttons are in the section below */}
      {billingStatus === "free" && (
        <p className="text-xs text-[#555]">
          Browse and discover referral links for free. Upgrade anytime.
        </p>
      )}

      {/* Active paid plan */}
      {billingStatus === "active" && (
        <div className="flex flex-wrap gap-2">
          {hasPortal && (
            <button
              onClick={openPortal}
              disabled={loading === "portal"}
              className="rounded-md border border-white/10 px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              {loading === "portal" ? "Opening…" : "Manage billing →"}
            </button>
          )}
          <button
            onClick={cancelPlan}
            disabled={loading === "cancel"}
            className="rounded-md border border-red-900/40 px-4 py-1.5 text-sm text-red-500 transition-colors hover:border-red-700/60 disabled:opacity-50"
          >
            {loading === "cancel" ? "Cancelling…" : "Cancel plan"}
          </button>
        </div>
      )}

      {/* Cancelling — access until period end */}
      {billingStatus === "cancelling" && (
        <div className="space-y-2">
          <p className="text-xs text-yellow-400">
            Your plan is cancelled. You retain full access until the period ends.
          </p>
          {hasPortal && (
            <button
              onClick={openPortal}
              disabled={loading === "portal"}
              className="rounded-md border border-white/10 px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              {loading === "portal" ? "Opening…" : "Reactivate via billing portal →"}
            </button>
          )}
        </div>
      )}

      {/* Payment issue */}
      {billingStatus === "past_due" && hasPortal && (
        <button
          onClick={openPortal}
          disabled={loading === "portal"}
          className="rounded-md bg-red-900/30 border border-red-700/40 px-4 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-900/50 disabled:opacity-50"
        >
          {loading === "portal" ? "Opening…" : "Update payment method →"}
        </button>
      )}

      {/* Expired */}
      {billingStatus === "expired" && (
        <div className="space-y-2">
          <p className="text-xs text-[#555]">Your subscription has ended. Resubscribe to restore access.</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/checkout?plan=standard"
              className="rounded-md border border-white/10 px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-white/20 hover:text-white"
            >
              Get Standard
            </a>
            <a
              href="/checkout?plan=pro"
              className="rounded-md border border-white/10 px-4 py-1.5 text-sm text-[#888] transition-colors hover:border-white/20 hover:text-white"
            >
              Get Pro
            </a>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
