"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { PLANS } from "@/lib/pricing";

export default function CheckoutSuccessPage() {
  const { data: session, update } = useSession();
  const [status, setStatus] = useState<"checking" | "activated" | "timeout">("checking");
  const [tierName, setTierName] = useState<string>("");

  useEffect(() => {
    let attempts = 0;
    const MAX_ATTEMPTS = 10; // 10 × 2s = 20s max wait

    async function pollAndActivate() {
      // Ask the server for the real DB tier (bypasses stale JWT)
      const res = await fetch("/api/user/tier");
      if (!res.ok) return;
      const { membershipTier } = await res.json() as { membershipTier: string };

      if (membershipTier === "STARTER" || membershipTier === "PREMIUM") {
        // Tier upgraded in DB — refresh the JWT so the session reflects it
        await update();
        const name = membershipTier === "STARTER" ? PLANS.STARTER.name : PLANS.PREMIUM.name;
        setTierName(name);
        setStatus("activated");
        return;
      }

      attempts++;
      if (attempts >= MAX_ATTEMPTS) {
        setStatus("timeout");
        return;
      }
      setTimeout(pollAndActivate, 2000);
    }

    // Small initial delay to give the webhook a head-start
    const t = setTimeout(pollAndActivate, 1500);
    return () => clearTimeout(t);
  }, [update]);

  // Already on a paid tier from existing session (e.g. page refresh)
  useEffect(() => {
    const tier = session?.user?.membershipTier;
    if (tier === "STARTER" || tier === "PREMIUM") {
      const name = tier === "STARTER" ? PLANS.STARTER.name : PLANS.PREMIUM.name;
      setTierName(name);
      setStatus("activated");
    }
  }, [session]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-xl font-semibold text-white">
          TrustRefer
        </Link>

        {status === "checking" && (
          <div className="mt-10">
            <Spinner />
            <p className="mt-4 text-sm text-[#888]">Activating your plan…</p>
            <p className="mt-1 text-xs text-[#555]">This usually takes a few seconds.</p>
          </div>
        )}

        {status === "activated" && (
          <div className="mt-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-2xl">
              ✓
            </div>
            <h1 className="text-lg font-semibold text-white">
              {tierName} plan activated!
            </h1>
            <p className="mt-2 text-sm text-[#888]">
              Your subscription is now active. Enjoy your benefits.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-white px-6 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              Go to homepage
            </Link>
          </div>
        )}

        {status === "timeout" && (
          <div className="mt-10">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-2xl">
              ⏳
            </div>
            <h1 className="text-lg font-semibold text-white">Payment received</h1>
            <p className="mt-2 text-sm text-[#888]">
              Your payment was successful. Your plan is being activated and will
              be available within a minute. Refresh the page if it hasn&apos;t
              updated yet.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-white px-6 py-2 text-sm font-medium text-black hover:opacity-90"
            >
              Go to homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
  );
}
