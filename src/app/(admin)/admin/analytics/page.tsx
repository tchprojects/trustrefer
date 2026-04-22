export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export const metadata = { title: "Click Analytics — TrustRefer Admin" };

async function getClickData() {
  const links = await prisma.link.findMany({
    where: { isApproved: true },
    select: {
      id: true,
      brandName: true,
      url: true,
      clickCount: true,
      isActive: true,
      category: { select: { name: true } },
    },
    orderBy: { clickCount: "desc" },
  });
  return links;
}

export default async function AnalyticsPage() {
  const links = await getClickData();

  const totalClicks = links.reduce((sum, l) => sum + l.clickCount, 0);
  const topLink = links[0] ?? null;

  // Group by brand — sum clicks across multiple URLs for same brand
  const byBrand = new Map<string, { clicks: number; urls: number; category: string }>();
  for (const l of links) {
    const existing = byBrand.get(l.brandName);
    if (existing) {
      existing.clicks += l.clickCount;
      existing.urls += 1;
    } else {
      byBrand.set(l.brandName, { clicks: l.clickCount, urls: 1, category: l.category.name });
    }
  }
  const brandRows = [...byBrand.entries()]
    .sort((a, b) => b[1].clicks - a[1].clicks);

  const maxClicks = brandRows[0]?.[1].clicks ?? 1;

  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-white">Click Analytics</h1>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Total clicks" value={totalClicks.toLocaleString()} />
        <StatCard label="Tracked links" value={links.length.toString()} />
        <StatCard
          label="Top brand"
          value={topLink?.brandName ?? "—"}
          sub={topLink ? `${topLink.clickCount.toLocaleString()} clicks` : undefined}
        />
      </div>

      {/* ── By brand ── */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">
          Clicks by brand
        </h2>
        <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
          {brandRows.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#555]">No click data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Brand</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Category</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[#555]">Links</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[#555]">Clicks</th>
                  <th className="w-32 px-4 py-2.5 text-xs font-medium text-[#555]"></th>
                </tr>
              </thead>
              <tbody>
                {brandRows.map(([brand, { clicks, urls, category }]) => (
                  <tr key={brand} className="border-b border-[#111] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{brand}</td>
                    <td className="px-4 py-3 text-[#666]">{category}</td>
                    <td className="px-4 py-3 text-right text-[#666]">{urls}</td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
                        <div
                          className="h-full rounded-full bg-white/30"
                          style={{ width: `${Math.round((clicks / maxClicks) * 100)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Per URL breakdown ── */}
      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-[#555]">
          All links — click breakdown
        </h2>
        <div className="overflow-hidden rounded-xl border border-[#1f1f1f] bg-[#0a0a0a]">
          {links.length === 0 ? (
            <p className="px-4 py-6 text-sm text-[#555]">No links yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Brand</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">URL</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-[#555]">Category</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-[#555]">Clicks</th>
                  <th className="px-4 py-2.5 text-xs font-medium text-[#555]">Status</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-[#111] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium text-white">{link.brandName}</td>
                    <td className="max-w-[200px] px-4 py-3">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-[#555] hover:text-white"
                        title={link.url}
                      >
                        {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-[#666]">{link.category.name}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">
                      {link.clickCount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        link.isActive
                          ? "bg-green-950/50 text-green-400"
                          : "bg-red-950/50 text-red-400"
                      }`}>
                        {link.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4">
      <p className="text-xs text-[#888]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#555]">{sub}</p>}
    </div>
  );
}
