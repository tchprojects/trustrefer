"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { PLANS, PLAN_TIER_TO_SLUG } from "@/lib/pricing";

interface PricingSectionProps {
  isLoggedIn: boolean;
  currentTier?: string;
}

const DISPLAY_PLANS = [PLANS.STANDARD, PLANS.STARTER, PLANS.PREMIUM];

export function PricingSection({ isLoggedIn, currentTier }: PricingSectionProps) {
  const router = useRouter();

  function handlePaidPlanClick(tier: "STARTER" | "PREMIUM") {
    const slug = PLAN_TIER_TO_SLUG[tier]; // "standard" or "pro"
    if (isLoggedIn) {
      router.push(`/checkout?plan=${slug}`);
    } else {
      router.push(`/login?plan=${slug}`);
    }
  }

  return (
    <div className="mt-16 mb-10">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Simple, transparent pricing
        </h2>
        <p className="mt-2 text-sm text-[#888]">
          Choose the plan that fits how you share and discover referrals
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {DISPLAY_PLANS.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const isStarter = plan.tier === "STARTER";
          const isFree = plan.tier === "STANDARD";

          return (
            <div
              key={plan.tier}
              className={`relative flex flex-col rounded-xl border p-6 ${
                isStarter
                  ? "border-white/30 bg-[#0f0f0f]"
                  : "border-white/10 bg-[#0a0a0a]"
              }`}
            >
              {/* Most Popular badge */}
              {isStarter && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full border border-white/20 bg-white px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-black">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-5">
                <p className="text-sm font-medium text-[#888]">{plan.name}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
                  {plan.priceLabel.split("/")[0]}
                  {plan.monthlyGbp > 0 && (
                    <span className="text-sm font-normal text-[#666]">/month</span>
                  )}
                </p>
              </div>

              {/* Features */}
              <ul className="mb-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#888]">
                    <Check size={14} className="mt-0.5 shrink-0 text-white/50" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isFree ? (
                <div className="rounded-md border border-white/10 py-2 text-center text-sm text-[#555]">
                  Free — no signup needed
                </div>
              ) : isCurrent ? (
                <div className="rounded-md border border-white/10 py-2 text-center text-sm text-[#555]">
                  Current plan
                </div>
              ) : (
                <button
                  onClick={() => handlePaidPlanClick(plan.tier as "STARTER" | "PREMIUM")}
                  className={`w-full rounded-md py-2 text-sm font-medium transition-opacity ${
                    isStarter
                      ? "bg-white text-black hover:opacity-90"
                      : "border border-white/20 text-white hover:bg-white/5"
                  }`}
                >
                  Get {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
