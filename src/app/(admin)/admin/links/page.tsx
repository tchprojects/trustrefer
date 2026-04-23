export const dynamic = "force-dynamic";
export const metadata = { title: "Links — Admin" };

import { prisma } from "@/lib/prisma";
import { LinkReviewTable } from "@/components/admin/LinkReviewTable";
import { PLAN_MONTHLY_COST, getExpiryDate, getExpiryStatus, type ExpiryStatus } from "@/lib/pricing";

export default async function AdminLinksPage() {
  const [submissions, categories, publishedLinks] = await Promise.all([
    prisma.linkSubmission.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.linkSubmission.findMany({
      where: { status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true, membershipTier: true } },
        link: {
          select: {
            id: true,
            brandName: true,
            url: true,
            headline: true,
            isActive: true,
            publishedAt: true,
            planAtPublish: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    }),
  ]);

  // For each published link, find waitlist demand: brand requests for the same brand+category
  // that are still PENDING (i.e., someone wants this slot)
  const publishedWithDemand = await Promise.all(
    publishedLinks.map(async (sub) => {
      const categoryId = sub.link?.category?.id;
      const brandName = sub.link?.brandName ?? sub.brandName;

      let waitlistDemand = 0;
      if (categoryId) {
        waitlistDemand = await prisma.brandRequest.count({
          where: {
            brandName: { equals: brandName, mode: "insensitive" },
            categoryId,
            status: "PENDING",
          },
        });
      }

      const publishedAt = sub.link?.publishedAt ?? null;
      const planAtPublish = sub.link?.planAtPublish ?? "STARTER";
      const expiryDate = publishedAt ? getExpiryDate(publishedAt, planAtPublish) : null;
      const expiryStatus: ExpiryStatus | null = expiryDate ? getExpiryStatus(expiryDate) : null;

      return { ...sub, waitlistDemand, expiryDate, expiryStatus };
    })
  );

  const expiredCount    = publishedWithDemand.filter((s) => s.expiryStatus === "expired").length;
  const expiringSoonCount = publishedWithDemand.filter((s) => s.expiryStatus === "expiring-soon").length;
  const demandCount     = publishedWithDemand.filter((s) => s.waitlistDemand > 0).length;

  return (
    <div className="space-y-10">
      {/* Pending submissions */}
      <div>
        <h1 className="mb-6 text-lg font-semibold text-white">
          Pending submissions{" "}
          <span className="text-sm font-normal text-[#888]">({submissions.length})</span>
        </h1>
        <LinkReviewTable submissions={submissions} categories={categories} />
      </div>

      {/* Published referrals */}
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-white">
            Published referrals{" "}
            <span className="text-sm font-normal text-[#888]">({publishedLinks.length})</span>
          </h2>
          {expiredCount > 0 && (
            <span className="rounded-full bg-red-950/50 px-2.5 py-1 text-xs font-medium text-red-400">
              {expiredCount} expired
            </span>
          )}
          {expiringSoonCount > 0 && (
            <span className="rounded-full bg-yellow-950/50 px-2.5 py-1 text-xs font-medium text-yellow-400">
              {expiringSoonCount} expiring soon
            </span>
          )}
          {demandCount > 0 && (
            <span className="rounded-full bg-blue-950/50 px-2.5 py-1 text-xs font-medium text-blue-400">
              {demandCount} with waitlist demand
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-md border border-[#1f1f1f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
                <th className="px-4 py-3 text-left font-medium text-[#888]">Brand</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Category</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Published by</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Published</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Expires</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Demand</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Status</th>
              </tr>
            </thead>
            <tbody>
              {publishedWithDemand.map((sub) => {
                const tier = sub.user?.membershipTier ?? "STANDARD";
                const cost = PLAN_MONTHLY_COST[tier] ?? 0;
                const planLabel = tier === "PREMIUM" ? "Pro" : tier === "STARTER" ? "Standard" : "Free";
                const isHighlighted =
                  (sub.expiryStatus === "expired" || sub.expiryStatus === "expiring-soon") &&
                  sub.waitlistDemand > 0;

                return (
                  <tr
                    key={sub.id}
                    className={`border-b border-[#1f1f1f] last:border-0 ${
                      isHighlighted
                        ? "bg-amber-950/20 hover:bg-amber-950/30"
                        : "bg-[#050505] hover:bg-white/[0.02]"
                    }`}
                  >
                    <td className="px-4 py-3 text-white">
                      <div className="flex items-center gap-2">
                        {sub.link?.brandName ?? sub.brandName}
                        {isHighlighted && (
                          <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-400">
                            Replacement demand
                          </span>
                        )}
                      </div>
                      {sub.link?.headline && (
                        <div className="text-xs text-[#555]">{sub.link.headline}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#888]">
                      {sub.link?.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{sub.user?.name ?? "—"}</div>
                      <div className="text-xs text-[#555]">{sub.user?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded border border-white/10 px-1.5 py-0.5 text-xs text-[#888]">
                        {planLabel}
                        {cost > 0 && ` · £${cost.toFixed(2)}/mo`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#555]">
                      {sub.link?.publishedAt
                        ? new Date(sub.link.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : new Date(sub.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {sub.expiryDate ? (
                        <div>
                          <span className="text-[#555]">
                            {new Date(sub.expiryDate).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </span>
                          <div className="mt-0.5">
                            <ExpiryBadge status={sub.expiryStatus!} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#333]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {sub.waitlistDemand > 0 ? (
                        <span className="rounded-full bg-blue-950/50 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                          {sub.waitlistDemand} waiting
                        </span>
                      ) : (
                        <span className="text-[#333]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${sub.link?.isActive ? "text-green-500" : "text-red-500"}`}>
                        {sub.link?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {publishedLinks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-[#555]">
                    No published referrals yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-[#444]">
          Expired links remain live until manually removed. Rows highlighted in amber have both expired/expiring status and pending waitlist demand — consider replacing these first.
        </p>
      </div>
    </div>
  );
}

function ExpiryBadge({ status }: { status: ExpiryStatus }) {
  if (status === "expired") {
    return (
      <span className="rounded-full bg-red-950/50 px-2 py-0.5 text-[10px] font-medium text-red-400">
        Expired
      </span>
    );
  }
  if (status === "expiring-soon") {
    return (
      <span className="rounded-full bg-yellow-950/50 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
        Expiring soon
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-950/50 px-2 py-0.5 text-[10px] font-medium text-green-400">
      Active
    </span>
  );
}
