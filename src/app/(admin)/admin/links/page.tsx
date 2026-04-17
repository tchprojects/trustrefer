export const dynamic = "force-dynamic";
export const metadata = { title: "Links — Admin" };

import { prisma } from "@/lib/prisma";
import { LinkReviewTable } from "@/components/admin/LinkReviewTable";
import { PLAN_MONTHLY_COST } from "@/lib/pricing";

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
        link: { select: { brandName: true, url: true, headline: true, isActive: true, category: { select: { name: true } } } },
      },
    }),
  ]);

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

      {/* Published referrals tracking */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Published referrals{" "}
          <span className="text-sm font-normal text-[#888]">({publishedLinks.length})</span>
        </h2>
        <div className="overflow-hidden rounded-md border border-[#1f1f1f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
                <th className="px-4 py-3 text-left font-medium text-[#888]">Brand</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Category</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Published by</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Date</th>
                <th className="px-4 py-3 text-left font-medium text-[#888]">Status</th>
              </tr>
            </thead>
            <tbody>
              {publishedLinks.map((sub) => {
                const tier = sub.user?.membershipTier ?? "STANDARD";
                const cost = PLAN_MONTHLY_COST[tier] ?? 0;
                const planLabel = tier === "PREMIUM" ? "Pro" : tier === "STARTER" ? "Starter" : "Free";
                return (
                  <tr key={sub.id} className="border-b border-[#1f1f1f] bg-[#050505] last:border-0">
                    <td className="px-4 py-3 text-white">
                      <div>{sub.link?.brandName ?? sub.brandName}</div>
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
                      {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
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
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-[#555]">
                    No published referrals yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
