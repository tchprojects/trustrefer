export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard — TrustRefer" };

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SLOT_LIMIT, PLANS, getExpiryDate, getExpiryStatus } from "@/lib/pricing";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { membershipTier: true },
  });
  const tier = dbUser?.membershipTier ?? "STANDARD";
  const slotLimit = SLOT_LIMIT[tier] ?? 0;
  const planName = tier === "PREMIUM" ? "Pro" : "Standard";

  const [pendingSubmissions, approvedSubmissions, pendingBrandRequests, approvedBrandRequests] =
    await Promise.all([
      prisma.linkSubmission.count({ where: { userId, status: "PENDING" } }),
      prisma.linkSubmission.count({ where: { userId, status: "APPROVED" } }),
      prisma.brandRequest.count({ where: { userId, status: "PENDING" } }),
      prisma.brandRequest.count({ where: { userId, status: "APPROVED" } }),
    ]);

  const slotsUsed = pendingSubmissions + approvedSubmissions + pendingBrandRequests;
  const slotsRemaining = Math.max(0, slotLimit - slotsUsed);

  // Check for expiring/expired live links
  const liveLinks = await prisma.link.findMany({
    where: { submittedBy: userId, isApproved: true, isActive: true },
    select: { id: true, brandName: true, publishedAt: true, planAtPublish: true },
  });

  const expiringCount = liveLinks.filter((l) => {
    if (!l.publishedAt || !l.planAtPublish) return false;
    const status = getExpiryStatus(getExpiryDate(l.publishedAt, l.planAtPublish));
    return status === "expiring-soon";
  }).length;

  const expiredCount = liveLinks.filter((l) => {
    if (!l.publishedAt || !l.planAtPublish) return false;
    const status = getExpiryStatus(getExpiryDate(l.publishedAt, l.planAtPublish));
    return status === "expired";
  }).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Overview</h1>
        <span className="rounded border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-[#666]">
          {planName} plan
        </span>
      </div>

      {/* Slot usage */}
      <section className="mb-8">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">Slot usage</h2>
        <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-5">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <span className="text-3xl font-semibold text-white">{slotsUsed}</span>
              <span className="ml-1 text-sm text-[#555]">/ {slotLimit} slots used</span>
            </div>
            <span className={`text-sm font-medium ${slotsRemaining === 0 ? "text-red-400" : "text-green-400"}`}>
              {slotsRemaining} remaining
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 overflow-hidden rounded-full bg-[#1a1a1a]">
            <div
              className={`h-full rounded-full transition-all ${slotsUsed >= slotLimit ? "bg-red-500" : "bg-white/40"}`}
              style={{ width: slotLimit > 0 ? `${Math.min(100, (slotsUsed / slotLimit) * 100)}%` : "0%" }}
            />
          </div>
          {/* Breakdown */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-[#111] px-3 py-2.5">
              <p className="text-lg font-semibold text-white">{approvedSubmissions}</p>
              <p className="text-[10px] text-[#555]">Live links</p>
            </div>
            <div className="rounded-lg bg-[#111] px-3 py-2.5">
              <p className="text-lg font-semibold text-white">{pendingSubmissions}</p>
              <p className="text-[10px] text-[#555]">Pending submissions</p>
            </div>
            <div className="rounded-lg bg-[#111] px-3 py-2.5">
              <p className="text-lg font-semibold text-white">{pendingBrandRequests}</p>
              <p className="text-[10px] text-[#555]">Pending requests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Alert cards */}
      {(expiringCount > 0 || expiredCount > 0) && (
        <section className="mb-8 space-y-3">
          {expiredCount > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-red-400">
                  {expiredCount} link{expiredCount > 1 ? "s" : ""} expired
                </p>
                <p className="text-xs text-[#666]">These remain live until admin acts. Contact support if needed.</p>
              </div>
              <Link href="/dashboard/links" className="text-xs text-red-400 hover:text-red-300">
                View →
              </Link>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-yellow-900/50 bg-yellow-950/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-yellow-400">
                  {expiringCount} link{expiringCount > 1 ? "s" : ""} expiring soon
                </p>
                <p className="text-xs text-[#666]">Links expire within 30 days. Contact support to discuss renewal.</p>
              </div>
              <Link href="/dashboard/links" className="text-xs text-yellow-400 hover:text-yellow-300">
                View →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Quick stats */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">Activity</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Live links" value={approvedSubmissions} href="/dashboard/links" />
          <StatCard label="Pending" value={pendingSubmissions} href="/dashboard/links" />
          <StatCard label="Brand requests" value={pendingBrandRequests + approvedBrandRequests} href="/dashboard/requests" />
          <StatCard
            label="Plan validity"
            value={tier === "PREMIUM" ? "12 mo" : "3 mo"}
            sub="per published link"
          />
        </div>
      </section>

      {/* Upgrade nudge for STARTER */}
      {tier === "STARTER" && (
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <p className="text-sm font-medium text-white">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-[#555]">
            Get 20 slots, 12-month link validity, and waitlist access for £4.99/month.
          </p>
          <Link
            href="/checkout?plan=pro"
            className="mt-3 inline-block rounded-md bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90"
          >
            Upgrade now
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  sub,
}: {
  label: string;
  value: number | string;
  href?: string;
  sub?: string;
}) {
  const inner = (
    <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4 transition-colors hover:border-white/10">
      <p className="text-xs text-[#888]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-[10px] text-[#555]">{sub}</p>}
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
