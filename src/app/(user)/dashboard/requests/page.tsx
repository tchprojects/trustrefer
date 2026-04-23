export const dynamic = "force-dynamic";
export const metadata = { title: "Brand Requests — TrustRefer Dashboard" };

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  PENDING:  { label: "Pending review", cls: "bg-yellow-950/50 text-yellow-400" },
  APPROVED: { label: "Approved",       cls: "bg-green-950/50 text-green-400"  },
  REJECTED: { label: "Rejected",       cls: "bg-red-950/50 text-red-400"      },
};

export default async function DashboardRequestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const brandRequests = await prisma.brandRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  const pending   = brandRequests.filter((r) => r.status === "PENDING");
  const approved  = brandRequests.filter((r) => r.status === "APPROVED");
  const rejected  = brandRequests.filter((r) => r.status === "REJECTED");

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-white">Brand Requests</h1>
        <div className="flex gap-3 text-xs text-[#666]">
          <span>{pending.length} pending</span>
          <span>{approved.length} approved</span>
          <span>{rejected.length} rejected</span>
        </div>
      </div>

      <p className="text-xs text-[#555]">
        Brand requests let you request a brand be added to TrustRefer in a specific category.
        Each pending request occupies a slot on your plan. Rejected requests free up your slot.
      </p>

      {brandRequests.length === 0 ? (
        <div className="rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] px-4 py-10 text-center text-sm text-[#555]">
          No brand requests yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f]">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Brand</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Category</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Note</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Requested</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Status</th>
              </tr>
            </thead>
            <tbody>
              {brandRequests.map((req) => {
                const badge = STATUS_BADGE[req.status] ?? STATUS_BADGE.PENDING;
                return (
                  <tr key={req.id} className="border-b border-[#111] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{req.brandName}</td>
                    <td className="px-4 py-3 text-[#666]">{req.category.name}</td>
                    <td className="max-w-[180px] px-4 py-3 text-xs text-[#555]">
                      {req.note ?? <span className="text-[#333]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#666]">
                      {new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-lg border border-white/5 bg-[#0a0a0a] p-4 text-xs text-[#555]">
        <p className="font-medium text-[#666]">How brand requests work</p>
        <ul className="mt-2 space-y-1 list-disc pl-4">
          <li>Submit a brand name and category — admin reviews and decides whether to add it.</li>
          <li>A pending request counts as one occupied slot.</li>
          <li>Once approved, the brand appears in the platform. Rejected requests free your slot.</li>
          <li>Duplicates are prevented — you can only request the same brand/category once.</li>
        </ul>
      </div>
    </div>
  );
}
