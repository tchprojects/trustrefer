import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

async function getStats() {
  const [totalLinks, pendingLinks, totalUsers, pendingReports, pendingBrandRequests, waitlistEntries] =
    await Promise.all([
      prisma.link.count({ where: { isApproved: true } }),
      prisma.linkSubmission.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.brandRequest.count({ where: { status: "PENDING" } }),
      prisma.waitlistEntry.count(),
    ]);
  return { totalLinks, pendingLinks, totalUsers, pendingReports, pendingBrandRequests, waitlistEntries };
}

export const metadata = { title: "Admin — TrustRefer" };

export default async function AdminPage() {
  const stats = await getStats();

  const cards = [
    { label: "Approved links", value: stats.totalLinks },
    { label: "Pending submissions", value: stats.pendingLinks, alert: stats.pendingLinks > 0 },
    { label: "Total users", value: stats.totalUsers },
    { label: "Open reports", value: stats.pendingReports, alert: stats.pendingReports > 0 },
    { label: "Brand requests", value: stats.pendingBrandRequests, alert: stats.pendingBrandRequests > 0 },
    { label: "Waitlist entries", value: stats.waitlistEntries },
  ];

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">Overview</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4">
            <p className="text-xs text-[#888]">{card.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-semibold text-white">{card.value}</span>
              {card.alert && card.value > 0 && (
                <Badge variant="warning">needs review</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
