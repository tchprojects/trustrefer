import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/pricing";
import Link from "next/link";
import { Check } from "lucide-react";
import { BillingActions } from "@/components/account/BillingActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — TrustRefer" };

function fmt(d: Date | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Always read from DB — never trust stale JWT for billing data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      membershipTier: true,
      createdAt: true,
      subscription: {
        select: {
          status: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) redirect("/login");

  const sub = user.subscription;
  const tier = user.membershipTier;
  const isPaid = tier !== "STANDARD";

  // Derive human-readable billing status
  type BillingStatus = "free" | "active" | "cancelling" | "past_due" | "expired";
  let billingStatus: BillingStatus = "free";
  if (isPaid) {
    if (!sub || sub.status === "INACTIVE") billingStatus = "active"; // manually upgraded
    else if (sub.status === "ACTIVE" && sub.cancelAtPeriodEnd) billingStatus = "cancelling";
    else if (sub.status === "ACTIVE") billingStatus = "active";
    else if (sub.status === "PAST_DUE") billingStatus = "past_due";
    else billingStatus = "expired";
  }

  const planConfig =
    tier === "STARTER" ? PLANS.STARTER
    : tier === "PREMIUM" ? PLANS.PREMIUM
    : PLANS.STANDARD;

  const statusLabel: Record<BillingStatus, string> = {
    free:       "Free",
    active:     "Active",
    cancelling: "Cancels " + fmt(sub?.currentPeriodEnd ?? null),
    past_due:   "Payment issue",
    expired:    "Expired",
  };

  const statusColor: Record<BillingStatus, string> = {
    free:       "text-[#666]",
    active:     "text-green-400",
    cancelling: "text-yellow-400",
    past_due:   "text-red-400",
    expired:    "text-red-400",
  };

  const hasPortal = !!sub?.stripeCustomerId;
  const memberSince = fmt(user.createdAt);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Simple top nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-white transition-opacity hover:opacity-70">
            TrustRefer
          </Link>
          <Link href="/" className="text-sm text-[#666] hover:text-white">← Home</Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
        <h1 className="mb-1 text-xl font-semibold text-white">My Account</h1>
        <p className="mb-8 text-sm text-[#555]">
          {user.name ?? user.email} · Member since {memberSince}
        </p>

        {/* ── Billing card ── */}
        <section className="mb-6">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">Billing</h2>

          <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
            {/* Plan header */}
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-white">{planConfig.name} plan</p>
                <p className="mt-0.5 text-sm text-[#666]">
                  {planConfig.monthlyGbp > 0
                    ? `£${planConfig.monthlyGbp.toFixed(2)}/month`
                    : "No charge"}
                </p>
              </div>
              <span className={`text-sm font-medium ${statusColor[billingStatus]}`}>
                {statusLabel[billingStatus]}
              </span>
            </div>

            {/* Renewal / expiry info */}
            {billingStatus === "active" && sub?.currentPeriodEnd && (
              <p className="mb-4 text-xs text-[#555]">
                Next billing: {fmt(sub.currentPeriodEnd)}
              </p>
            )}
            {billingStatus === "past_due" && (
              <p className="mb-4 text-xs text-red-400">
                Your last payment failed. Update your payment method to keep access.
              </p>
            )}

            {/* Features */}
            <ul className="mb-6 space-y-1.5">
              {planConfig.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#888]">
                  <Check size={13} className="mt-0.5 shrink-0 text-white/40" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Actions — client component handles all mutations */}
            <BillingActions
              tier={tier}
              billingStatus={billingStatus}
              hasPortal={hasPortal}
            />
          </div>
        </section>

        {/* ── Upgrade options (only for Free or Standard users) ── */}
        {(tier === "STANDARD" || tier === "STARTER") && (
          <section>
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">
              {tier === "STANDARD" ? "Upgrade your plan" : "Available upgrade"}
            </h2>

            <div className={`grid gap-4 ${tier === "STANDARD" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {tier === "STANDARD" && (
                <UpgradeCard plan={PLANS.STARTER} slug="standard" highlighted />
              )}
              <UpgradeCard plan={PLANS.PREMIUM} slug="pro" highlighted={tier === "STARTER"} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function UpgradeCard({
  plan,
  slug,
  highlighted,
}: {
  plan: typeof PLANS.STARTER | typeof PLANS.PREMIUM;
  slug: string;
  highlighted: boolean;
}) {
  return (
    <div className={`rounded-xl border p-5 ${highlighted ? "border-white/20 bg-[#0f0f0f]" : "border-white/10 bg-[#0a0a0a]"}`}>
      <p className="text-base font-semibold text-white">{plan.name}</p>
      <p className="mt-0.5 mb-3 text-sm text-[#666]">£{plan.monthlyGbp.toFixed(2)}/month</p>
      <ul className="mb-4 space-y-1.5">
        {plan.features.slice(0, 4).map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs text-[#888]">
            <Check size={11} className="mt-0.5 shrink-0 text-white/40" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={`/checkout?plan=${slug}`}
        className={`block w-full rounded-md py-2 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
          highlighted ? "bg-white text-black" : "border border-white/20 text-white hover:bg-white/5"
        }`}
      >
        Upgrade to {plan.name}
      </Link>
    </div>
  );
}
