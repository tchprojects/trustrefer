"use client";

import type { WaitlistEntryWithRelations } from "@/types";

interface WaitlistTableProps {
  entries: WaitlistEntryWithRelations[];
}

const TIER_LABEL: Record<string, string> = {
  STANDARD: "Standard",
  PREMIUM: "Premium",
};

export function WaitlistTable({ entries }: WaitlistTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-[#555]">No waitlist entries yet.</p>;
  }

  // Group by brand
  const byBrand = entries.reduce<Record<string, WaitlistEntryWithRelations[]>>((acc, e) => {
    const key = `${e.linkId}__${e.link.brandName}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(byBrand).map(([key, brandEntries]) => {
        const brandName = key.split("__")[1];
        const sorted = [...brandEntries].sort((a, b) => a.position - b.position);
        return (
          <div key={key}>
            <h2 className="mb-3 text-sm font-medium text-white">{brandName}</h2>
            <div className="overflow-hidden rounded-md border border-[#1f1f1f]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
                    <th className="px-4 py-2 text-left text-xs text-[#555]">#</th>
                    <th className="px-4 py-2 text-left text-xs text-[#555]">User</th>
                    <th className="px-4 py-2 text-left text-xs text-[#555]">Tier</th>
                    <th className="px-4 py-2 text-left text-xs text-[#555]">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-[#1f1f1f] last:border-b-0 bg-[#0a0a0a]"
                    >
                      <td className="px-4 py-2.5 text-xs font-mono text-[#666]">
                        {entry.position}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-white">
                        {entry.user.name ?? entry.user.email}
                        <span className="ml-1 text-[#555]">
                          {entry.user.name ? `· ${entry.user.email}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#888]">
                        {TIER_LABEL[entry.user.membershipTier] ?? entry.user.membershipTier}
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#555]">
                        {new Date(entry.createdAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
