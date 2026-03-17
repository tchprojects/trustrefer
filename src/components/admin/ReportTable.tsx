"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Report, Link, User } from "@prisma/client";

type ReportRow = Report & {
  link: Pick<Link, "brandName" | "url">;
  user: Pick<User, "name" | "email">;
};

interface ReportTableProps {
  reports: ReportRow[];
}

export function ReportTable({ reports }: ReportTableProps) {
  const [items, setItems] = useState(reports);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(id: string, action: "resolve" | "dismiss") {
    setLoadingId(id);
    await fetch(`/api/admin/reports/${id}/${action}`, { method: "POST" });
    setItems((prev) => prev.filter((r) => r.id !== id));
    setLoadingId(null);
  }

  if (items.length === 0) {
    return <p className="text-sm text-[#555]">No open reports.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((report) => {
        const isLoading = loadingId === report.id;
        return (
          <div
            key={report.id}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-white">{report.link.brandName}</span>
                <p className="mt-1.5 text-xs text-[#888] italic">&ldquo;{report.note}&rdquo;</p>
                <p className="mt-1.5 text-xs text-[#555]">
                  reported by {report.user.name ?? report.user.email} ·{" "}
                  {new Date(report.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => handleAction(report.id, "dismiss")}
                  title="Dismiss"
                >
                  <X size={13} />
                </Button>
                <Button
                  size="sm"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={() => handleAction(report.id, "resolve")}
                  title="Resolve"
                >
                  <Check size={13} />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
