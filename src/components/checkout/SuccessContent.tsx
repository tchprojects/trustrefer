"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

type Status = "verifying" | "activated" | "error";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { update } = useSession();

  const [status, setStatus] = useState<Status>("verifying");
  const [tierName, setTierName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("No payment session found. If you completed payment, check your Account page.");
      setStatus("error");
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch("/api/stripe/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (cancelled) return;

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(data.error ?? "Could not verify payment. Please contact support.");
          setStatus("error");
          return;
        }

        const { membershipTier } = await res.json() as { membershipTier: string };

        // Refresh the JWT so the session reflects the new tier everywhere
        await update();

        const name =
          membershipTier === "STARTER"
            ? PLANS.STARTER.name
            : membershipTier === "PREMIUM"
              ? PLANS.PREMIUM.name
              : "";

        setTierName(name);
        setStatus("activated");
      } catch {
        if (!cancelled) {
          setErrorMsg("Network error. Please check your Account page to confirm your plan.");
          setStatus("error");
        }
      }
    }

    verify();
    return () => { cancelled = true; };
  }, [sessionId, update]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-xl font-semibold text-white">
          TrustRefer
        </Link>

        {/* Verifying */}
        {status === "verifying" && (
          <div className="mt-10">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
            <p className="mt-4 text-sm text-[#888]">Confirming your payment…</p>
          </div>
        )}

        {/* Success */}
        {status === "activated" && (
          <div className="mt-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 text-2xl text-white">
              ✓
            </div>
            <h1 className="text-lg font-semibold text-white">
              {tierName} plan activated!
            </h1>
            <p className="mt-2 text-sm text-[#888]">
              Your subscription is now active. Enjoy your benefits.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href="/account"
                className="inline-block rounded-md bg-white px-6 py-2 text-sm font-medium text-black hover:opacity-90"
              >
                View my account
              </Link>
              <Link href="/" className="text-xs text-[#555] hover:text-white">
                Go to homepage →
              </Link>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mt-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-900/40 bg-red-950/30 text-xl text-red-400">
              !
            </div>
            <h1 className="text-lg font-semibold text-white">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#888]">{errorMsg}</p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href="/account"
                className="inline-block rounded-md bg-white px-6 py-2 text-sm font-medium text-black hover:opacity-90"
              >
                Check my account
              </Link>
              <a
                href="mailto:support@trustrefer.co.uk"
                className="text-xs text-[#555] hover:text-white"
              >
                Contact support →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
