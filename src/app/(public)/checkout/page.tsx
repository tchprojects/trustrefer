import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PLANS, PLAN_SLUG_TO_TIER, PLAN_TIER_TO_SLUG, type PlanSlug } from "@/lib/pricing";
import Link from "next/link";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/checkout/CheckoutButton";

export const metadata = { title: "Review your plan — TrustRefer" };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const session = await auth();
  const { plan } = await searchParams;

  // Validate slug ("standard" or "pro")
  const validSlug: PlanSlug | null =
    plan === "standard" || plan === "pro" ? plan : null;

  // Redirect unauthenticated users back to login, preserving plan intent
  if (!session?.user?.id) {
    redirect(`/login?plan=${validSlug ?? "standard"}`);
  }

  if (!validSlug) {
    redirect("/");
  }

  // Map slug → DB tier key
  const dbTier = PLAN_SLUG_TO_TIER[validSlug];          // "STARTER" | "PREMIUM"
  const planConfig = PLANS[dbTier];
  const otherSlug: PlanSlug = validSlug === "standard" ? "pro" : "standard";
  const otherConfig = PLANS[PLAN_SLUG_TO_TIER[otherSlug]];

  const alreadyOnPlan = session.user.membershipTier === dbTier;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-white">
            TrustRefer
          </Link>
          <p className="mt-2 text-sm text-[#888]">Review your selected plan</p>
        </div>

        {/* Selected plan card */}
        <div className="rounded-xl border border-white/20 bg-[#0f0f0f] p-6">
          <div className="mb-1 text-xs font-medium uppercase tracking-wider text-[#555]">
            Selected plan
          </div>
          <div className="mb-4 flex items-end gap-2">
            <span className="text-2xl font-semibold text-white">{planConfig.name}</span>
            <span className="mb-0.5 text-lg font-medium text-white">
              {planConfig.priceLabel.split("/")[0]}
              <span className="text-sm font-normal text-[#666]">/month</span>
            </span>
          </div>

          <ul className="mb-6 space-y-2">
            {planConfig.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#888]">
                <Check size={13} className="mt-0.5 shrink-0 text-white/50" />
                {f}
              </li>
            ))}
          </ul>

          {alreadyOnPlan ? (
            <div className="rounded-md border border-white/10 py-2 text-center text-sm text-[#555]">
              This is your current plan
            </div>
          ) : (
            // Pass the DB tier key to the API — slugs are URL-only
            <CheckoutButton plan={dbTier} planName={planConfig.name} />
          )}
        </div>

        {/* Switch plan link */}
        {!alreadyOnPlan && (
          <p className="mt-4 text-center text-xs text-[#555]">
            Want{" "}
            <Link
              href={`/checkout?plan=${otherSlug}`}
              className="text-[#888] underline underline-offset-2 hover:text-white"
            >
              {otherConfig.name} ({otherConfig.priceLabel}) instead?
            </Link>
          </p>
        )}

        <p className="mt-3 text-center text-xs text-[#555]">
          <Link href="/" className="hover:text-[#888]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
