export const dynamic = "force-dynamic";
export const metadata = { title: "My Links — TrustRefer Dashboard" };

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getExpiryDate, getExpiryStatus, VALIDITY_MONTHS, type ExpiryStatus } from "@/lib/pricing";

export default async function DashboardLinksPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [submissions, liveLinks] = await Promise.all([
    // Pending submissions
    prisma.linkSubmission.findMany({
      where: { userId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: { link: { select: { category: { select: { name: true } } } } },
    }),
    // Approved/live links with their submission for category info
    prisma.linkSubmission.findMany({
      where: { userId, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      include: {
        link: {
          select: {
            id: true,
            brandName: true,
            url: true,
            isActive: true,
            publishedAt: true,
            planAtPublish: true,
            category: { select: { name: true } },
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Live / published links */}
      <section>
        <h1 className="mb-4 text-lg font-semibold text-white">
          Live links <span className="text-sm font-normal text-[#888]">({liveLinks.length})</span>
        </h1>
        {liveLinks.length === 0 ? (
          <EmptyState message="No live links yet. Submit a referral to get started." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Brand</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Category</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Published</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Expires</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Status</th>
                </tr>
              </thead>
              <tbody>
                {liveLinks.map((sub) => {
                  const link = sub.link;
                  const publishedAt = link?.publishedAt ?? sub.createdAt;
                  const planAtPublish = link?.planAtPublish ?? "STARTER";
                  const expiryDate = getExpiryDate(publishedAt, planAtPublish);
                  const expiryStatus = getExpiryStatus(expiryDate);
                  const validityMonths = VALIDITY_MONTHS[planAtPublish] ?? 3;

                  return (
                    <tr key={sub.id} className="border-b border-[#111] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{link?.brandName ?? sub.brandName}</p>
                        <a
                          href={link?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate text-xs text-[#555] hover:text-white"
                        >
                          {link?.url?.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-[#666]">{link?.category?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-[#666]">
                        {publishedAt
                          ? new Date(publishedAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                          : "—"}
                        <p className="text-[10px] text-[#444]">{validityMonths}-month validity</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#666]">
                        {new Date(expiryDate).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <ExpiryBadge status={expiryStatus} />
                          {!link?.isActive && (
                            <span className="rounded-full bg-[#1f1f1f] px-2 py-0.5 text-[10px] text-[#555]">
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pending submissions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">
          Pending submissions <span className="text-sm font-normal text-[#888]">({submissions.length})</span>
        </h2>
        {submissions.length === 0 ? (
          <EmptyState message="No pending submissions." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Brand</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">URL</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Submitted</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-[#111] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{sub.brandName}</td>
                    <td className="max-w-[200px] px-4 py-3">
                      <span className="truncate text-xs text-[#555]">
                        {sub.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#666]">
                      {new Date(sub.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-yellow-950/50 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                        Pending review
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-[#444]">
        Expired links remain live until admin acts. They do not auto-unpublish.
      </p>
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-8 text-center text-sm text-[#555]">
      {message}
    </div>
  );
}
