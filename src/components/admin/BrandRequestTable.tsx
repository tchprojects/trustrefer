"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { BrandRequestWithRelations } from "@/types";

interface BrandRequestTableProps {
  requests: BrandRequestWithRelations[];
}

export function BrandRequestTable({ requests }: BrandRequestTableProps) {
  const [items, setItems] = useState(requests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(id: string, action: "approve" | "reject") {
    setLoadingId(id);
    await fetch(`/api/admin/brand-requests/${id}/${action}`, { method: "POST" });
    setItems((prev) => prev.filter((r) => r.id !== id));
    setLoadingId(null);
  }

  if (items.length === 0) {
    return <p className="text-sm text-[#555]">No pending brand requests.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((req) => {
        const isLoading = loadingId === req.id;
        return (
          <div
            key={req.id}
            className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-white">{req.brandName}</span>
                  <Badge variant="default">{req.category.name}</Badge>
                  <Badge variant={req.user.membershipTier === "PREMIUM" ? "warning" : "default"}>
                    {req.user.membershipTier === "PREMIUM" ? "Premium" : "Standard"}
                  </Badge>
                </div>
                {req.note && (
                  <p className="mt-1.5 text-xs text-[#888] italic">&ldquo;{req.note}&rdquo;</p>
                )}
                <p className="mt-1.5 text-xs text-[#555]">
                  requested by {req.user.name ?? req.user.email} ·{" "}
                  {new Date(req.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => handleAction(req.id, "reject")}
                  title="Reject"
                >
                  <X size={13} />
                </Button>
                <Button
                  size="sm"
                  disabled={isLoading}
                  loading={isLoading}
                  onClick={() => handleAction(req.id, "approve")}
                  title="Approve"
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
